# coding:utf8
from fabric.api import run, env, cd, prefix, settings
from fabric.operations import local

# ## ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ###

'''
Во избежание проблем с подключением к серверу, необходимо создать ssh ключ на локальной машине
и перебросить public-key на сервер в папку .ssh.

Чтобы упростить работу с базой данных на сервере и на локальной машине необходимо в home
директории создать файлик .pgpass и забить в него параметры соединения по шаблону:
host:port:dbname:username:password

При возникновении ошибки
FATAL:  Peer authentication failed for user "postgres"
надо в файле /etc/postgresql/9.#/cluster_name/pg_hba.conf
заменить строчку
local   all             postgres                                peer
на
local   all             postgres                                md5

Пример скрипта ./dump_db.sh на сервере:
pg_dump -c --no-owner -U user_name -h host_name db_name > dump.sql

Пример скрипта prettify_linenums.sh на серевер
psql -U user_name -h host_name db_name < _utils/prettyprint_linenums.sql
'''


### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ###

env.hosts = ['phosphorus.locum.ru']
env.user = 'hosting_mmailm'
env.activate = 'source /home/hosting_mmailm/projects/env/bin/activate'

app_dir = "/home/hosting_mmailm/projects/django-tealeaf"


def compile_js(minify='-m'):
    local("find -name *.coffee -execdir coffeebar -m -o ../static/js/ %s {} \;" % minify)


def compile_css():
    local("find -name config.rb -execdir compass compile --force \;")


def minify():
    compile_css()
    compile_js()


def pip_sync(on_server=False):
    """
    синхронизирует среду с requirements.txt
    """
    if on_server:
        with cd(app_dir):
            with prefix(env.activate):
                # local("which python")
                with settings(warn_only=True):
                    run('pip freeze | grep -v -f requirements.txt - | xargs pip uninstall -y')
                run('pip install -r requirements.txt')
                run('pip freeze > requirements.txt')
    else:
        with prefix("../env/bin/activate"):
            # local("which python")
            with settings(warn_only=True):
                local('pip freeze | grep -v -f requirements.txt - | xargs pip uninstall -y')
            local('pip install -r requirements.txt')
            local('pip freeze > requirements.txt')


def prettyprint():
    with cd(app_dir):
        run("./prettify_linenums.sh ")  # add linenums to  prettyprint on server


def build_production():
    local("git checkout master")
    local("git merge -X theirs dev")
    local("git merge --no-ff dev")
    minify()
    with settings(warn_only=True):
        local("git commit -a -m 'minify scripts and css'")
    local("git checkout production")
    local("git merge master")
    local("git checkout dev")


def backup(only_base=False):
    local("ssh-add ~/.ssh/locum.ru")  # add ssh-key

    # create backip_archive on server
    with cd(app_dir):
        run("./dump_db.sh")  # create database dump
        if not only_base:
            run("tar -czf media.tgz media")  # create media dump

    # remove local old backup
    local("rm -f dump.sql")
    if not only_base:
        local("rm -f media.tgz")

    # download database backup from server
    local("scp -C {user}@{host}:{app_dir}/dump.sql dump.sql".format(
        user=env.user, host=env.hosts[0], app_dir=app_dir)
    )
    if not only_base:
        # download media backup from server
        local("scp -C {user}@{host}:{app_dir}/media.tgz media.tgz".format(
            user=env.user, host=env.hosts[0], app_dir=app_dir)
        )

    # restore database
    # local("dropdb -U postgres tealeaf")
    # local("createdb -U postgres tealeaf")
    local("psql -U postgres -d tealeaf -f dump.sql")

    if not only_base:
        # restore media
        local("rm -rf media")
        local("mkdir media")
        local("tar -xf media.tgz")


def deploy(without_build=False):
    if not without_build:
        build_production()
    local("ssh-add ~/.ssh/locum.ru")
    local("git push --all -u")
    with cd(app_dir):
        with prefix(env.activate):
            run("git stash")
            run("git pull")
            with settings(warn_only=True):
                run("git stash apply")
                run('pip install -r requirements.txt')
            run("python manage.py migrate")
            run("python manage.py collectstatic --noinput")
            run("touch django.wsgi")
