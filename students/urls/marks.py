__author__ = 'mick'

from django.conf.urls import patterns, url

urlpatterns = patterns('students.views.marks',
   url(r'discipline/add$', "disciplines.add"),
   url(r'discipline/remove$', "disciplines.remove"),
   url(r'discipline/edit', "disciplines.edit"),
   url(r'discipline/list', "disciplines.index"),
   url(r'$', 'index'),
)
