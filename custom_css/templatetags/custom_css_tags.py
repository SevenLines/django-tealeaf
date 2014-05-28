from django import template
from custom_css.models import CustomCSS

register = template.Library()


@register.inclusion_tag('custom_css/template_tags/custom_css.html')
def custom_css():
    css = CustomCSS.objects.filter(enabled=True)
    return {'css': css}

