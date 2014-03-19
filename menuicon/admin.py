from django.contrib import admin
from .models import MenuIcon
from cms.extensions import PageExtensionAdmin


class MenuIconAdmin(PageExtensionAdmin):
    list_display = ['extended_object']

    def is_draft_page(self, obj):
        return obj.extended_object.publisher_is_draft

admin.site.register(MenuIcon, MenuIconAdmin)
