# -*- coding: utf-8 -*-

from cms.plugin_base import CMSPluginBase

from cms.plugin_pool import plugin_pool
from django.contrib.admin.options import StackedInline
from django.forms import TextInput, Textarea
from textile.functions import textile
from django.db import models
from labs.models import TaskEx, LabEx

from .models import Lab, Task


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
    admin_preview = True
    model = Lab

    render_template = "labs/lab.html"

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


class TaskExPlugin(CMSPluginBase):
    name = u'Задача'
    model = TaskEx
    render_template = 'labs/task.html'
    text_enabled = True
    cache = False

    def render(self, context, instance, placeholder):
        instance.description = textile_without_p(instance.description)
        context['task'] = instance
        context['placeholder'] = placeholder
        context['complex_choices'] = TaskEx.COMPLEX_CHOICES
        return context

plugin_pool.register_plugin(TaskExPlugin)


class LabsExPlugin(CMSPluginBase):
    name = u"Лабораторная"
    model = LabEx
    render_template = 'labs/labex.html'
    allow_children = True
    text_enabled = True

    child_classes = ['TaskExPlugin']

    def render(self, context, instance, placeholder):
        instance.description = textile_without_p(instance.description)

        context['lab'] = instance
        context['placeholder'] = placeholder
        context['tasks'] = instance.child_plugin_instances

        # if instance.render_style:
        #     self.render_template = instance.render_style

        return context

plugin_pool.register_plugin(LabsExPlugin)