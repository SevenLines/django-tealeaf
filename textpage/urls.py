from django.conf.urls import url
from django.conf.urls.i18n import i18n_patterns


urlpatterns = i18n_patterns('textpage.views',
    url(r'save/$', 'save'),
    url(r'image/upload/$', 'upload_image'),
    url(r'file/upload/$', 'upload_file'),
    url(r'image/remove/$', 'remove_image'),
    url(r'file/remove/$', 'remove_file'),
    url(r'$', 'index'),
)