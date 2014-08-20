from django.conf.urls import patterns, url

urlpatterns = patterns("main_page.views",
       url(r"activate-item$", "set_active"),
       url(r"list-items$", "list_items"),
       url(r"$", "index"),
)