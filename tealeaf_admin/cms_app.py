from cms.app_base import CMSApp
from cms.apphook_pool import apphook_pool
from django.utils.translation import ugettext_lazy as _

class TealeafAdminHook(CMSApp):
    name = _("tealeaf admin")
    urls = ["tealeaf_admin.urls"]

apphook_pool.register(TealeafAdminHook)