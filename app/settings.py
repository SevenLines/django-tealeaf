# coding: utf8
"""
Чтобы нормально организовать работу с сервером необходимо
как на локальной машине так и на сервере создать в папке на 2 уровня
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
from django.core.urlresolvers import reverse

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

try:
    credentials_path = ""
    credentials_path = os.path.join(os.path.dirname(BASE_DIR), "credentials.json")
    credentials = json.load(open(credentials_path))
except IOError as e:
    print("check existance of %s" % credentials_path)
    raise e

try:
    from settings_debug import *
except ImportError:
    pass

try:
    from settings_app import *
except ImportError:
    pass

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    # other finders..
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'cms.middleware.page.CurrentPageMiddleware',
    'cms.middleware.user.CurrentUserMiddleware',
    'cms.middleware.toolbar.ToolbarMiddleware',
    'cms.middleware.language.LanguageCookieMiddleware',
    # 'profiler.middleware.ProfilerMiddleware', # profiling
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.contrib.messages.context_processors.messages',
    'django.core.context_processors.i18n',
    'django.core.context_processors.request',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'cms.context_processors.cms_settings',
    'sekizai.context_processors.sekizai',
)

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

THUMBNAIL_PROCESSORS = (
    'easy_thumbnails.processors.colorspace',
    'easy_thumbnails.processors.autocrop',
    # 'easy_thumbnails.processors.scale_and_crop',
    'filer.thumbnail_processors.scale_and_crop_with_subject_location',
    'easy_thumbnails.processors.filters',
)

ROOT_URLCONF = 'app.urls'

WSGI_APPLICATION = 'app.wsgi.application'

try:
    from settings_db import *
except ImportError:
    pass

LANGUAGE_CODE = 'ru'
LANGUAGES = [
    ('ru', 'Russian')
]

TIME_ZONE = 'UTC'

USE_I18N = False

USE_L10N = True

USE_TZ = True

SITE_ID = 1

STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "templates/static"),
)

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

THUMBNAIL_BASEDIR = 'thumbs'


TEMPLATE_DIRS = (
    os.path.join(BASE_DIR, "templates"),
)

LOGIN_URL = "/"

CMS_TEMPLATES = (
    ('page.html', 'Page'),
    ('lesson_article.html', "Lesson article"),
    ('labs_list.html', "Labs list"),
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
)

PLUGIN_WRAPPER_ITEM_CLASSES = (
    ('list-group-item', 'list-group-item'),
)

SOUTH_MIGRATION_MODULES = {
    'easy_thumbnails': 'easy_thumbnails.south_migrations',
}

FILER_PAGINATE_BY = 50

CUSTOM_MENU_ITEMS = ({
    # 'name': 'ppl',
    'img': 'img/profle.png',
    'href': reverse("students.views.index"),
    },
)