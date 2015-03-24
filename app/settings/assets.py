import os
from app.settings import DEBUG, BASE_DIR, REQUIRE_JS_DEBUG

__author__ = 'm'

ASSETS_MODULES = [
    'app.assets'
]

ASSETS_CACHE = False
ASSETS_MANIFEST = False
if not DEBUG:
    ASSETS_AUTO_BUILD = False

ASSETS_DEBUG = REQUIRE_JS_DEBUG

ASSETS_ROOT = os.path.join(BASE_DIR, 'app/static')
