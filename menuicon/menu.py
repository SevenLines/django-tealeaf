from cms.models import Page
from menus.base import Modifier
from menus.menu_pool import menu_pool


class MenuIconModifier(Modifier):
    """

    """
    def modify(self, request, nodes, namespace, root_id,  post_cut, breadcrumb):
        if breadcrumb:
            return nodes
        for node in nodes:
            page = Page.objects.get(pk=node.id)
            extension = None

            if hasattr(page, "menuicon"):
                extension = page.menuicon

            node.icon = extension
        return nodes

menu_pool.register_modifier(MenuIconModifier)