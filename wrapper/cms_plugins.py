from cms.plugin_base import CMSPluginBase
from wrapper.models import Wrapper
from cms.plugin_pool import plugin_pool


class WrapperPlugin(CMSPluginBase):
    model = Wrapper
    # render_template = "plugin_markdown/markdown.html"
    render_template = Wrapper.LIST
    text_enabled = True
    allow_children = True

    def render(self, context, instance, placeholder):
        self.render_template = instance.template
        context['child_plugins'] = instance.child_plugin_instances
        context['wrap_class'] = instance.wrap_class
        context['item_class'] = instance.item_class
        return context

plugin_pool.register_plugin(WrapperPlugin)