# coding: utf-8

from cms.models.pluginmodel import CMSPlugin
from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool


class TocPlugin(CMSPluginBase):
    model = CMSPlugin
    render_template = "toc/table_of_contents.html"
    name = u"Содержание"

plugin_pool.register_plugin(TocPlugin)