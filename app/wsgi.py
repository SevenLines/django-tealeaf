"""
WSGI config for app project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/howto/deployment/wsgi/
"""

import os
import sys


#acitvate virtualenv
if sys.platform in ['linux2', 'linux']:
    activate_this = os.path.join(os.path.dirname(__file__), "../../env/bin/activate_this.py")
elif sys.platform == 'win32':
    activate_this = os.path.join(os.path.dirname(__file__), "..\\..\\_ENV\\bin\\activate_this.py")

execfile(activate_this, dict(__file__=activate_this))

# current dir
sys.path.append(os.path.dirname(__file__))
# application dir
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()
