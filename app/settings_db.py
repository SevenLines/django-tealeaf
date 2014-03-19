
# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'tealeaf2',
        'PASSWORD': '12345',
        'USER': 'postgres',
        'HOST': 'localhost',
        'PORT': '',
    }
}