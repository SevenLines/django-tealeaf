from django.conf.urls import patterns, url
from labs import views


urlpatterns = patterns('',
    url(r'^(?P<pk>\d+)/update_task$', views.update_task, name='update_task'),
)
