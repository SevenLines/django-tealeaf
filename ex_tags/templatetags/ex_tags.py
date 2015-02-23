# coding=utf-8
from django.core.urlresolvers import reverse
from django.template.defaultfilters import stringfilter
from django.template.loader import render_to_string
from django import template
from django.conf import settings
from django.utils.safestring import mark_safe
from main_page.models import MainPage

register = template.Library()

def obfuscate_string(value):
    return ''.join(['&#{};'.format(str(ord(char))) for char in value])

@register.simple_tag()
def custom_menu_items(request):
    out = ""

    if hasattr(settings, "CUSTOM_MENU_ITEMS"):
        for item in settings.CUSTOM_MENU_ITEMS:
            href = reverse(item.get('href', '')) if item.get('reverse') else item.get('href', '')
            out += render_to_string("ex_tags/menu_item.html", {
                'active': request.path == href,
                'href':  href,
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


@register.filter
@stringfilter
def obfuscate(value):
    return mark_safe(obfuscate_string(value))


@register.filter
@stringfilter
def obfuscate_mailto(value, text=False):
    mail = obfuscate_string(value)

    if text:
        link_text = text
    else:
        link_text = mail

    return mark_safe('<a href="%s%s">%s</a>'.format(
        obfuscate_string('mailto:'), mail, link_text))

@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)


@register.simple_tag
def requirejs(baseUrl, main, main_built, *args):
    add_modules = ",".join(["'" + arg+ "'" for arg in args])

    return render_to_string('ex_tags/requirejs.html', {
        'baseUrl': baseUrl,
        'main': main,
        'main_built': main_built,
        'add_modules': add_modules,
        'debug': settings.REQUIRE_JS_DEBUG,
    })