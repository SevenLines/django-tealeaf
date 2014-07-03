# coding: utf-8

from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool


class StudentInfoPlugin(CMSPluginBase):
    name = u"Списки студентов"
    render_template = "students/students/info.html"
    text_enabled = False
    allow_children = False


# TESTS #
class TestStudentInfoPlugin(StudentInfoPlugin):
    module = u"Тесты"
    render_template = "students/students/tests/info.html"


class LabInfoPluginAdmin(CMSPluginBase):
    name = u"Лабораторные-админка"
    render_template = "students/labs/info.html"
    text_enabled = False
    allow_children = False


class LabInfoPlugin(LabInfoPluginAdmin):
    name = u"Лабораторные"


plugin_pool.register_plugin(StudentInfoPlugin)
plugin_pool.register_plugin(TestStudentInfoPlugin)

plugin_pool.register_plugin(LabInfoPluginAdmin)
plugin_pool.register_plugin(LabInfoPlugin)