from django.template.loader import render_to_string
from django import template
# from .. import CUSTOM_MENU_ITEMS
from django.conf import settings

register = template.Library()

@register.simple_tag()
def custom_menu_items(request):
    out = ""

    if hasattr(settings, "CUSTOM_MENU_ITEMS"):
        for item in settings.CUSTOM_MENU_ITEMS:
            out += render_to_string("ex_tags/menu_item.html", {
                'active': request.path == item['href'],
                'href': item.get('href', ''),
                'img': item.get('img', ''),
                'title': item.get('title', '', ),
                'touchable': item.get('touchable', ''),
            })

    return out