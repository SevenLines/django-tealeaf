from django.conf.urls import patterns, include, url

urlpatterns = patterns("tracking_ex.views",
   url(r'statistics$', "stat"),
   url(r'visitors$', "visitors_list"),
)