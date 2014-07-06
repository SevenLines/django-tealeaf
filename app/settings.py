# coding: utf8
"""
Django settings for app project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import json
import os

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
    #'easy_thumbnails.processors.scale_and_crop',
    'filer.thumbnail_processors.scale_and_crop_with_subject_location',
    'easy_thumbnails.processors.filters',
)

ROOT_URLCONF = 'app.urls'

WSGI_APPLICATION = 'app.wsgi.application'

try:
    from settings_db import *
except ImportError:
    pass


# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'ru'
LANGUAGES = [
    ('ru', 'Russian')
]

TIME_ZONE = 'UTC'

USE_I18N = False

USE_L10N = True

USE_TZ = True

SITE_ID = 1


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "templates/static"),
)

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

TEMPLATE_DIRS = (
    # The docs say it should be absolute path: PROJECT_PATH is precisely one.
    # Life is wonderful!
    os.path.join(BASE_DIR, "templates"),
)

CMS_TEMPLATES = (
    ('page.html', 'Page'),
    ('lesson_article.html', "Lesson article"),
    ('labs_list.html', "Labs list"),
    ('articles_list.html', "Articles list"),
    #('js_tests/test_page.html', "Js-Tests"),
)


# cmsplugin_cascade setups

CMS_CASCADE_PLUGINS = ('bootstrap3',)
# CMS_MARKUP_OPTIONS = ('textile',)

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

#JASMINE_TEST_DIRECTORY = os.path.join(BASE_DIR, "jasmine-tests")

FILER_PAGINATE_BY = 50