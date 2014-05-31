
# Application definition

INSTALLED_APPS = (
    # 'django_admin_bootstrapped.bootstrap3',
    # 'django_admin_bootstrapped',

    'djangocms_admin_style',  # for the admin skin. You **must** add 'djangocms_admin_style' in the list before 'django.contrib.admin'.
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'cmsplugin_cascade',
    'djangocms_text_ckeditor',
    'cms',  # django CMS itself
    'mptt',  # utilities for implementing a modified pre-order traversal tree
    'menus',  # helper for model independent hierarchical website navigation
    'south',  # intelligent schema and data migrations
    'sekizai',  # for javascript and css management
    'filer',
    'easy_thumbnails',
    'cmsplugin_filer_file',
    'cmsplugin_filer_image',

    'plugin_markdown',
    'menuicon',
    'adminsortable',
    'labs',
    'toc',
    'email_obfuscator',
    'wrapper',
    'djangocms_file',
    'djangocms_flash',
    'custom_css',
    'django_ace',
    'compressor',
    'students',

    'django.contrib.messages',  # to enable messages framework (see :ref:`Enable messages <enable-messages>`)
)