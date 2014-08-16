# -*- coding: utf-8 -*-

from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool

from labs.models import TaskEx, LabEx
from labs.models import users_for_task


class TaskExPlugin(CMSPluginBase):
    name = u'Задача'
    model = TaskEx
    module = "Лабораторные"
    render_template = 'labs/task.html'
    text_enabled = True
    allow_children = False
    require_parent = True
    parent_classes = ['LabsExPlugin']

    def render(self, context, instance, placeholder):
        if hasattr(instance.parent, 'labex'):
            lab = instance.parent.labex
            if lab.render_style == LabEx.GALLERY:
                context['is_gallery'] = True

        instance.description = instance.description
        context['page'] = instance.page
        context['task'] = instance
        context['users'] = users_for_task(instance.pk)
        context['placeholder'] = placeholder
        context['complex_choices'] = TaskEx.COMPLEX_CHOICES
        return context


plugin_pool.register_plugin(TaskExPlugin)


class LabsExPlugin(CMSPluginBase):
    name = u"Лабораторная"
    model = LabEx
    module = "Лабораторные"
    render_template = 'labs/labex.html'
    allow_children = True
    text_enabled = True
    child_classes = ['TaskExPlugin']

    def render(self, context, instance, placeholder):
        instance.description = instance.description

        context['lab'] = instance
        context['page'] = instance.page
        context['placeholder'] = placeholder
        context['tasks'] = instance.child_plugin_instances
        context['is_gallery'] = instance.render_style == LabEx.GALLERY

        return context


plugin_pool.register_plugin(LabsExPlugin)