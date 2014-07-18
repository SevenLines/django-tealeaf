from django.conf.urls import patterns, url
from labs import views


urlpatterns = patterns('labs.views',
    url(r'add_task/(?P<pk>\d+)$', 'add_task'),
    url(r'update_task/(?P<pk>\d+)$', 'update_task'),
    url(r'update_lab/(?P<pk>\d+)$', 'update_lab'),
)
