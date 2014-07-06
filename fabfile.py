from fabric.api import run, env, cd, roles, prefix

env.hosts = ['phosphorus.locum.ru']
env.user = 'hosting_mmailm'
env.activate = 'source ~/env-tealeaf/bin/activate'

def deploy():
    app_dir = "~/projects/django-tealeaf"
    with cd(app_dir):
        with prefix(env.activate):
            run("git pull")
            run("python manage.py migrate")
            run("python manage.py collectstatic --noinput")
            run("touch django.wsgi")
