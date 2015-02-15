# coding: utf-8

from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool


class StudentInfoPlugin(CMSPluginBase):
    name = u"Списки студентов"
    render_template = "students/student/index.html"
    text_enabled = False
    allow_children = False


plugin_pool.register_plugin(StudentInfoPlugin)