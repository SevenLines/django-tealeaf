from django.conf.urls import patterns, url

__author__ = 'm'


urlpatterns = patterns('browser.views',
    url(r'/(?P<path>.*)$', 'index', name='index'),
)