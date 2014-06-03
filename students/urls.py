__author__ = 'mick'

from django.conf.urls import patterns, url

urlpatterns = patterns('students.views',
   url(r'ajax/$', 'ajax.student.index', ),
   url(r'ajax/add/$', 'ajax.student.add', ),
   url(r'ajax/remove/$', 'ajax.student.remove', ),
)