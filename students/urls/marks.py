__author__ = 'mick'

from django.conf.urls import patterns, url

urlpatterns = patterns('students.views.marks',
   url(r'discipline/add$', "disciplines.add"),
   url(r'discipline/remove$', "disciplines.remove"),
   url(r'discipline/edit', "disciplines.edit"),
   url(r'discipline/list', "disciplines.index"),

   url(r'lesson/list$', "lesson_list"),
   url(r'lesson/add$', "lesson_add"),
   url(r'lesson/remove$', "lesson_remove"),
   url(r'lesson/edit$', "lesson_edit"),
   url(r'marks/save$', "marks_save"),

   url(r'students$', "students"),

   url(r'$', 'index'),
)
