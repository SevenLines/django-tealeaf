__author__ = 'mick'

from django.conf.urls import patterns, url

urlpatterns = patterns('students.views.marks',
   url(r'$', 'index'),
)
