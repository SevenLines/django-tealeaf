# coding=utf-8
from django.template.loader import render_to_string
from django import template
from django.conf import settings
from main_page.models import MainPage

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


@register.simple_tag
def theme(css_path=''):
    """
    Рендерит дополнительный css с темой
    :param css_path:
    :return:
    """
    if css_path == '':
        css_path = MainPage.solo().current_theme_css
    if css_path == '':
        return ""

    return render_to_string("ex_tags/link_css.html", {
        'css_path': css_path
    })