#coding:utf8
from fabric.api import run, env, cd, prefix
from fabric.operations import local

### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ###
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
'''
### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ###

env.hosts = ['phosphorus.locum.ru']
env.user = 'hosting_mmailm'
env.activate = 'source ~/env-tealeaf/bin/activate'

app_dir = "~/projects/django-tealeaf"

def compile_js(minify='-m'):
    local("find -name *.coffee -execdir coffeebar -m -o ../static/js/ %s {} \;" % minify)


def compile_css():
    local("find -name config.rb -execdir compass compile --force \;")


def minify():
    compile_css()
    compile_js()


def build_production():
    local("git checkout master")
    local("git merge --no-ff dev")
    local("git checkout production")
    local("git merge --no-ff master")
    local("git checkout dev")


def backup_server_media(only_base=False):
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


def deploy():
    build_production()
    local("ssh-add ~/.ssh/locum.ru")
    local("git push --all -u")
    with cd(app_dir):
        with prefix(env.activate):
            run("git pull")
            run("python manage.py migrate")
            run("python manage.py collectstatic --noinput")
            run("touch django.wsgi")
