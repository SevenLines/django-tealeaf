# coding: utf8
"""
Чтобы нормально организовать работу с сервером необходимо
как на локальной машине так и на сервере создать в папке на 3 уровня
выше данного файла файл с именем credentials.json, в котором будут
прописаны все настройки для приложения, пример содержимого файла:

{
    "database": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": "tealeaf",
        "PASSWORD": "12345",
        "USER": "postgres",
        "HOST": "localhost",
        "PORT": ""
    },
    "SECRET_KEY": "812738912739812739812",
    "DEBUG": "0",
    "ALLOWED_HOSTS": [
        "*"
    ]
}

"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import json
import os
from django.contrib import messages

from django.core.urlresolvers import reverse
import django_assets
import sys

BASE_DIR = os.path.dirname((os.path.dirname(os.path.dirname(__file__))))

credentials_path = ""
credentials_path = os.path.join(BASE_DIR, "credentials.json")
try:
    credentials = json.load(open(credentials_path))
except IOError as e:
    print("check existance of %s" % credentials_path)
    raise e

ROOT_URLCONF = 'app.urls'

WSGI_APPLICATION = 'app.wsgi.application'

LANGUAGE_CODE = 'ru'
LANGUAGES = [
    ('ru', 'Russian')
]
TIME_ZONE = 'UTC'
USE_I18N = False
USE_L10N = True
USE_TZ = True
SITE_ID = 1

SESSION_EXPIRE_AT_BROWSER_CLOSE = True

LOGIN_URL = "/"

CMS_TEMPLATES = (
    ('page.html', 'Page'),
    ('lesson_article.html', "Lesson article"),
    ('articles_list.html', "Articles list"),
    # ('js_tests/test_page.html', "Js-Tests"),
)

CMS_CASCADE_PLUGINS = ('bootstrap3',)

CMS_PLACEHOLDER_CONF = {
    'Page Section': {
        'plugins': ['BootstrapContainerPlugin'],
    },
}

PLUGIN_MARKDOWN_CLASSES = (
    ("bs-callout bs-callout-danger", "bs-callout bs-callout-danger"),
    ("bs-callout bs-callout-warning", "bs-callout bs-callout-warning"),
    ("bs-callout bs-callout-info", "bs-callout bs-callout-info"),
)

PLUGIN_WRAPPER_CLASSES = (
    ('list-group', 'list-group'),
    ('text-center', 'text-center'),
    ('main-banner', 'main-banner'),
    ('items-list', 'items-list'),
)

PLUGIN_WRAPPER_ITEM_CLASSES = (
    ('list-group-item', 'list-group-item'),
)

SOUTH_MIGRATION_MODULES = {
    'easy_thumbnails': 'easy_thumbnails.south_migrations',
}

FILER_PAGINATE_BY = 50

CUSTOM_MENU_ITEMS = ({
                         'img': 'img/profle.png',
                         'href': 'tracking_ex.views.stat',
                         'reverse': True,
                         # 'href': reverse("tracking_ex.views.stat"),
                         'title': 'кто тут',
                         'touchable': True
                     },)

MESSAGE_TAGS = {
    messages.ERROR: 'danger'
}

MIGRATION_MODULES = {
    'cms': 'cms.migrations_django',
    'menus': 'menus.migrations_django',
}

from app.settings.debug import *
from app.settings.applications import *
from app.settings.db import *
from app.settings.log import *
from app.settings.tests import *
from app.settings.assets import *
from app.settings.dirs import *
from app.settings.middleware import *
from app.settings.version import *