from django.conf.urls import patterns, url, include

__author__ = 'm'


urlpatterns = patterns('students.views',
                       url(r'labs/new/$', 'labsview.new'),
                       url(r'labs/show/$', 'labsview.show'),
                       url(r'labs/save/$', 'labsview.save'),
                       url(r'labs/delete/$', 'labsview.delete'),
                       url(r'labs/save-order/$', 'labsview.lab_save_order'),
                       url(r'labs/$', 'labsview.index'),

                       url(r'tasks/new/$', 'tasksview.new'),
                       url(r'tasks/show/$', 'tasksview.show'),
                       url(r'tasks/save/$', 'tasksview.save'),
                       url(r'tasks/delete/$', 'tasksview.delete'),
                       url(r'tasks/$', 'tasksview.index'),
                       )
