from django.conf.urls import patterns, url

urlpatterns = patterns("page_extend.views",
    url(r'publish/(\d+)$', 'publish_page'),
    url(r'update/$', 'update_page'),
)