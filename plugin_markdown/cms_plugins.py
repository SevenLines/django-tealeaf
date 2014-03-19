from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool
from django.utils.text import Truncator
from plugin_markdown.models import MarkdownSnippet


class MarkdownPlugin(CMSPluginBase):
    model = MarkdownSnippet
    render_template = "plugin_markdown/markdown.html"
    text_enabled = True
    # admin_preview = True

    def render(self, context, instance, placeholder):
        context['raw'] = instance.body.raw
        context['text'] = instance.body.rendered
        context['image'] = instance.image
        context['body_class'] = instance.body_class
        return context



plugin_pool.register_plugin(MarkdownPlugin)