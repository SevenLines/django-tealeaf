from fabric.api import run, env, cd, prefix
from fabric.operations import local

env.hosts = ['phosphorus.locum.ru']
env.user = 'hosting_mmailm'
env.activate = 'source ~/env-tealeaf/bin/activate'

compile_css_find = "find -name config.rb -execdir compass {} \;"


def generate_js(minify='-m'):
    local("find -name *.coffee -execdir coffeebar -m -o ../static/js/ %s {} \;" % minify)


def compile_css(parameter='compile'):
    local(compile_css_find.format(parameter))


def deploy():
    app_dir = "~/projects/django-tealeaf"
    local("git push --all -u")
    with cd(app_dir):
        with prefix(env.activate):
            run("git pull")
            run("python manage.py migrate")
            run("python manage.py collectstatic --noinput")
            run("touch django.wsgi")
