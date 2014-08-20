from django.conf.urls import patterns, url

urlpatterns = patterns("main_page.views",

       url(r"$", "index"),
)