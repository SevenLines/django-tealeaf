from django.conf.urls import patterns, url, include

__author__ = 'm'


urlpatterns = patterns('students.views',
                       url(r'labs/new$', 'labsview.new'),
                       url(r'labs/show/', 'labsview.show'),
                       url(r'labs/save/', 'labsview.save'),
                       url(r'labs/delete/', 'labsview.delete'),
                       url(r'labs/$', 'labsview.index'),
                       )
