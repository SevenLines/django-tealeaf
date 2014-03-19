from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool
from django.contrib.admin.options import StackedInline
from django.forms import TextInput, Textarea
from textile.functions import textile
from .models import Lab, Task
from django.contrib import admin
from django.db import models
from adminsortable.admin import SortableStackedInline, SortableAdmin


class LabTaskInline(StackedInline):
    model = Task
    extra = 1
    formfield_overrides = {
        models.CharField: {'widget': TextInput(attrs={'size': '20'})},
        models.TextField: {'widget': Textarea(attrs={'rows': '4', 'cols': '60'})},
    }
    fieldsets = [
        (None, {'fields': ['task_number', 'description', 'complexity', 'image']}),
        ('User info', {'fields': ['selected', 'user'], 'classes': ['collapse', ]}),
    ]
    fk_name = 'lab'


def textile_without_p(text):
    text = textile(text)
    return text[4:-4]


class LabsPlugin(CMSPluginBase):
    name = u"Lab tasks list"
    # formfield_overrides = {
    #     models.TextField: {'widget': Textarea(attrs={'rows': '4', 'cols': '80'})},
    # }
    admin_preview = True
    model = Lab

    render_template = "labs/lab.html"

    # change_form_template = 'cms2/sortable-stacked-inline-change-form.html'
    text_enabled = True
    inlines = [LabTaskInline]

    def render(self, context, instance, placeholder):
        instance.description = textile_without_p(instance.description)

        tasks = list(Task(description=textile_without_p(t.description),
                          complexity=t.complexity,
                          selected=t.selected,
                          user=t.user,
                          task_number=t.task_number,
                          image=t.image) for t in instance.task_set.all())

        context['tasks'] = tasks
        context['lab'] = instance
        context['placeholder'] = placeholder

        if instance.render_style:
            self.render_template = instance.render_style

        return context


plugin_pool.register_plugin(LabsPlugin)