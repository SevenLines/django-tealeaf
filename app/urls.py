from django.conf.urls import include, patterns, url
from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.conf import settings
from django.views.generic.base import TemplateView

admin.autodiscover()

urlpatterns = i18n_patterns('',
    url(r'^labs-control/', include('labs.urls.labs_control')),
    url(r'^students-url/', include('students.urls.students')),
    url(r'^marks-url/', include('students.urls.marks')),
    url(r'^articles/', include('articles.urls')),
    url(r'^main-page/', include('main_page.urls')),
    url(r'^tracking/', include('tracking_ex.urls')),
    url(r'^file_browser', include('my_file_browser.urls')),
    url(r'^robots\.txt$', TemplateView.as_view(template_name="robots.txt", content_type="text/plain")),
    url(r'^admin/', include(admin.site.urls)),
    url(r'login/', "app.views.login_user"),
    url(r'^labs/', include('labs.urls')),
    url(r'^', include('cms.urls')),
)

# if settings.DEBUG:
urlpatterns = patterns('',
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
    url(r'', include('django.contrib.staticfiles.urls')),
) + urlpatterns

