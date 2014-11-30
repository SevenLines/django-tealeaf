# coding=utf-8
from django import template
from django.shortcuts import render
from django.template.context import RequestContext
from django.template.loader import render_to_string

register = template.Library()

@register.simple_tag
def pe_settings(request):
    context = {
        'request': request
    }
    context = RequestContext(request, context)
    return render_to_string("page_extend/page_settings.html", context)