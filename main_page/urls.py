from django.conf.urls import patterns, url

urlpatterns = patterns("main_page.views",
       url(r"item/activate$", "set_active"),
       url(r"item/list$", "list_items"),
       url(r"item/save$", "save_item"),
       url(r"item/add$", "add_item"),
       url(r"item/remove$", "remove_item"),
       url(r"item$", "item"),
       url(r"$", "index"),
)