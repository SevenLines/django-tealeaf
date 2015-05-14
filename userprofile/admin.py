# coding=utf-8
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.template.loader import render_to_string
from django.utils.html import format_html
from userprofile.models import UserProfile


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False

    verbose_name_plural = 'user'

class UserAdmin(UserAdmin):
    inlines = (UserProfileInline, )
    list_display = UserAdmin.list_display + ('is_admin', 'disciplines', )

    def is_admin(self, user):
        return user.is_admin

    def disciplines(self, user):
        if user.is_admin:
            return "полный доступ"

        return render_to_string("userprofile/admin/discipline.html", {
            'disciplines': user.profile.disciplines.all()
        })

    is_admin.boolean = True

admin.site.unregister(User)
admin.site.register(User, UserAdmin)