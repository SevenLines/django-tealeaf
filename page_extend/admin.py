from django.contrib import admin
from page_extend.models import PageExtend
from cms.extensions import PageExtensionAdmin


class PageExtendAdmin(PageExtensionAdmin):
    pass
    # list_display = ['extended_object']
    #
    # def is_draft_page(self, obj):
    #     return obj.extended_object.publisher_is_draft
#
admin.site.register(PageExtend, PageExtendAdmin)
