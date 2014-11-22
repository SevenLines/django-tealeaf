from django.conf.urls import patterns, url


urlpatterns = patterns('labs.views.labscontrol',
    url(r'labs-editor/labs/update$', 'update_lab'),
    url(r'labs-editor/labs/add', 'add_lab'),
    url(r'labs-editor/labs/remove/(\d+)', 'remove_lab'),
    url(r'labs-editor/labs/json', '_json.labs'),


    url(r'labs-editor/tasks/update$', 'update_task'),
    url(r'labs-editor/tasks/remove/(\d+)', 'remove_task'),
    url(r'labs-editor/tasks/add', 'add_task'),

    url(r'labs$', 'labs'),
    url(r'labs-tree$', 'tree'),
    url(r'$', 'labs_editor'),
)
