__author__ = 'mick'

from django.conf.urls import patterns, url
from tealeaf_admin import views

urlpatterns = patterns('tealeaf_admin.views',
    url(r'^$', 'index', name='index'),
    url(r'^login/$', 'login', name='login'),
)