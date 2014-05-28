# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases
import sys

if 'test' in sys.argv:
    print('using test database')
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': 'tealeaf',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'tealeaf',
            'PASSWORD': '12345',
            'USER': 'postgres',
            'HOST': 'localhost',
            'PORT': '',
        }
    }