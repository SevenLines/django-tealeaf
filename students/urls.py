__author__ = 'mick'

from django.conf.urls import patterns, url

urlpatterns = patterns('students.views',
   url(r'ajax/group/remove$', 'ajax.group.remove', ),
   url(r'ajax/group/update$', 'ajax.group.update', ),
   url(r'ajax/group/add/$', 'ajax.group.add', ),
   url(r'ajax/group/$', 'ajax.group.index', ),
   url(r'ajax/student/remove/$', 'ajax.student.remove', ),
   url(r'ajax/student/add/$', 'ajax.student.add', ),
   url(r'ajax/student/$', 'ajax.student.index', ),
   url(r'ajax/labs/discipline/remove/$', 'ajax.labs.discipline.remove', ),
   url(r'ajax/labs/discipline/add/$', 'ajax.labs.discipline.add', ),
   url(r'ajax/labs/discipline/$', 'ajax.labs.discipline.index', ),
   url(r'ajax/year/$', 'ajax.index', ),
)
