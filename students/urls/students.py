__author__ = 'mick'

from django.conf.urls import patterns, url

urlpatterns = patterns('students.views.students',

   url(r'ajax/json/years$', 'ajax.json.years'),
   url(r'ajax/json/groups/copy_to_next_year$', 'ajax.json.copy_to_next_year', ),
   url(r'ajax/json/groups/save$', 'ajax.json.save_groups'),
   url(r'ajax/json/groups$', 'ajax.json.groups'),
   url(r'ajax/json/students/save$', 'ajax.json.save_students'),
   url(r'ajax/json/students/task/filter$', 'ajax.json.list_students'),
   url(r'ajax/json/students$', 'ajax.json.students'),
   url(r'ajax/json/set-captain$', 'ajax.json.set_captain'),

   url(r'ajax/students/xlsx$', 'ajax.xlsx'),

   url(r'$', 'index'),
)
