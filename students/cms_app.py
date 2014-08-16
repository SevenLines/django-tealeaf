from cms.app_base import CMSApp
from cms.apphook_pool import apphook_pool




from django.utils.translation import ugettext_lazy as _


class StudentsHook(CMSApp):
    name = _("students")
    urls = ["students.urls"]

apphook_pool.register(StudentsHook)

