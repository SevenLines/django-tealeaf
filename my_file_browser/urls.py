from django.conf.urls import patterns, url

urlpatterns = patterns('my_file_browser.views',
        url(r'ajax/upload$', 'ajax.file.upload'),
)
