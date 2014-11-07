# Application definition

INSTALLED_APPS = (

    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # 'cmsplugin_cascade',  # bootstrap inline plugin
    # 'djangocms_text_ckeditor',
    'cms',  # django CMS itself
    'mptt',  # utilities for implementing a modified pre-order traversal tree
    'menus',  # helper for model independent hierarchical website navigation
    # 'south',  # intelligent schema and data migrations
    'sekizai',  # for javascript and css management
    'djangocms_admin_style',
    'django.contrib.admin',
    'filer',
    'easy_thumbnails',
    # 'cmsplugin_filer_file',
    # 'cmsplugin_filer_image',
    'ex_tags',

    'plugin_markdown',
    'page_extend',
    'labs',
    'toc',
    'wrapper',
    'django_ace',
    # 'djangocms_file',
    # 'djangocms_flash',
    'custom_css',
    'students',
    'tealeaf_admin',
    'articles',
    'my_file_browser',
    'main_page',
    'tracking',
    'tracking_ex',
    'django_assets',
)