# -*- coding: utf-8 -*-

from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool

from labs.models import TaskEx, LabEx, LabsList, Lab, Task


class LabsListPlugin(CMSPluginBase):
    name = u'Список лабораторных заданий'
    allow_children = False
    model = LabsList
    render_template = 'labs-control/cms-plugin/labs-plugin.html'
    cache = False

    def render(self, context, instance, placeholder):
        if instance.group:
            context['labs'] = Lab.all_for_group(instance.group.pk)
        elif instance.discipline:
            context['labs'] = Lab.all_for_discipline(instance.discipline.pk)
        context['show_users'] = instance.show_users
        context['is_plugin'] = True
        context['complex_choice_tokens'] = dict(Task.COMPLEX_CHOICES)
        return context


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
        context['users'] = instance.users()
        context['placeholder'] = placeholder
        context['complex_choices'] = TaskEx.COMPLEX_CHOICES
        return context


# plugin_pool.register_plugin(TaskExPlugin)


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


# plugin_pool.register_plugin(LabsExPlugin)
# plugin_pool.register_plugin(LabsListPlugin)