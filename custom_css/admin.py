from django.contrib import admin
from custom_css.forms import CustomCSSForm
from custom_css.models import CustomCSS


class CustomCSSAdmin(admin.ModelAdmin):
    # fields = ['title', 'css']
    list_display = ('title', 'css', 'enabled')
    form = CustomCSSForm

admin.site.register(CustomCSS, CustomCSSAdmin)
