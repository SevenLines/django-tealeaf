# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases
import sys

from app.settings import credentials


if 'test' in sys.argv:
    print('using test database')
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': 'tealeaf_test.dbs',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': credentials["database"]['ENGINE'],
            'NAME': credentials["database"]['NAME'],
            'PASSWORD': credentials["database"]['PASSWORD'],
            'USER': credentials["database"]['USER'],
            'HOST': credentials["database"]['HOST'],
            'PORT': credentials["database"]['PORT'],
        },
        'sqlite': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': 'tealeaf.dbs',
        }
    }