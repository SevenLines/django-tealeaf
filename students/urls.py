__author__ = 'mick'

from django.conf.urls import patterns, url

urlpatterns = patterns('students.views',

   url(r'ajax/json/years$', 'ajax.json.years'),
   url(r'ajax/json/groups/save$', 'ajax.json.save_groups'),
   url(r'ajax/json/groups$', 'ajax.json.groups'),
   url(r'ajax/json/students/save$', 'ajax.json.save_students'),
   url(r'ajax/json/students$', 'ajax.json.students'),

   url(r'ajax/group/remove$', 'ajax.group.remove', ),
   url(r'ajax/group/update$', 'ajax.group.update', ),
   url(r'ajax/group/add/$', 'ajax.group.add', ),
   url(r'ajax/group/copy_to_next_year$', 'ajax.group.copy_to_next_year', ),
   url(r'ajax/group/$', 'ajax.group.index', ),

   url(r'ajax/student/remove/$', 'ajax.student.remove', ),
   url(r'ajax/student/add/$', 'ajax.student.add', ),
   url(r'ajax/student/list.json$', 'ajax.student.list_students', ),
   url(r'ajax/student/$', 'ajax.student.index', ),

   url(r'ajax/year/$', 'ajax.index', ),
   url(r'$', 'index'),
)
