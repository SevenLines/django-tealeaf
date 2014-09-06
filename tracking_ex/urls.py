from django.conf.urls import patterns, url

urlpatterns = patterns("tracking_ex.views",
                       url(r'statistics/$', "stat"),
                       url(r'visitors/$', "visitors_list"),
)