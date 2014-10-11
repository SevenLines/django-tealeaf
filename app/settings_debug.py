
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
from app.settings import credentials


SECRET_KEY = credentials['SECRET_KEY']
DONT_USE_METRICS = int(credentials.get('DONT_USE_METRICS', 0))

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = int(credentials['DEBUG'])

TEMPLATE_DEBUG = DEBUG

ALLOWED_HOSTS = credentials['ALLOWED_HOSTS']

import sys
if 'test' in sys.argv:
    SOUTH_TESTS_MIGRATE = False
