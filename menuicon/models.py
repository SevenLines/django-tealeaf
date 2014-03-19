from filer.fields.image import FilerImageField
from cms.extensions import PageExtension
from cms.extensions import extension_pool
from cms.models import Page


class MenuIcon(PageExtension):
    image = FilerImageField(null=True, blank=True, default=None, verbose_name="image")

extension_pool.register(MenuIcon)
#
# from menus.base import NavigationNode
# NavigationNode.page_instance = lambda u: Page.objects.filter(pk = u.id)[0]

