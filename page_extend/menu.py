from cms.models import Page
from menus.base import Modifier
from menus.menu_pool import menu_pool


class PageExtendModifier(Modifier):
    """

    """
    def modify(self, request, nodes, namespace, root_id,  post_cut, breadcrumb):
        if breadcrumb:
            return nodes
        for node in nodes:
            page = Page.objects.get(pk=node.id)

            pageextend = page.pageextend if hasattr(page, "pageextend") else None
            if pageextend:
                node.icon = pageextend.image
                node.authentication_required = pageextend.authentication_required
        return nodes

menu_pool.register_modifier(PageExtendModifier)