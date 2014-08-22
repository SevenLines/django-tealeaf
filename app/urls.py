import re
from django.conf.urls import include, patterns, url
from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.conf import settings

admin.autodiscover()

urlpatterns = i18n_patterns('',
    url(r'^labs/', include('labs.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^students/', include('students.urls')),
    url(r'^articles/', include('articles.urls')),
    url(r'^main-page/', include('main_page.urls')),
    url(r'^file_browser', include('my_file_browser.urls')),
    url(r'^', include('cms.urls')),
    # url(r'^filebrowser_filer/', include('ckeditor_filebrowser_filer.urls')),
)

if settings.DEBUG:
    urlpatterns = patterns('',
        url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
            {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
        url(r'', include('django.contrib.staticfiles.urls')),
    ) + urlpatterns

