from cms.app_base import CMSApp
from cms.apphook_pool import apphook_pool

from django.utils.translation import ugettext_lazy as _


class LabsHook(CMSApp):
    name = _("labs")
    urls = ["labs.urls.labs_control"]


apphook_pool.register(LabsHook)

