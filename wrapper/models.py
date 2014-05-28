from cms.models.pluginmodel import CMSPlugin
from django.conf import settings
from django.db.models.fields import CharField
from custom_css.models import CustomCSS


class Wrapper(CMSPlugin):
    LIST = "wrapper/list.html"
    BLOCK = "wrapper/block.html"

    TEMPLATES = (
        (LIST, "list"),
        (BLOCK, "div block")
    )

    CLASSES = (
    )

    ITEM_CLASSES = (
    )

    if hasattr(settings, "PLUGIN_WRAPPER_TEMPLATES"):
        TEMPLATES += settings.PLUGIN_WRAPPER_TEMPLATES
    if hasattr(settings, "PLUGIN_WRAPPER_CLASSES"):
        CLASSES += settings.PLUGIN_WRAPPER_CLASSES
    if hasattr(settings, "PLUGIN_WRAPPER_ITEM_CLASSES"):
        ITEM_CLASSES += settings.PLUGIN_WRAPPER_ITEM_CLASSES

    if hasattr(settings, "PLUGIN_MARKDOWN_CLASSES"):
        try:
            CLASSES += settings.PLUGIN_MARKDOWN_CLASSES + CustomCSS.list()
        except:
            pass

    # template for render sequence of plugins
    template = CharField(max_length=100, default=LIST, choices=TEMPLATES)
    # custom class for tag to wrap around sequence of plugins
    wrap_class = CharField(max_length=255, default="", blank=True, choices=CLASSES)
    # custom class for each item withing sequence of plugins
    item_class = CharField(max_length=255, default="", blank=True, choices=ITEM_CLASSES)

    def __unicode__(self):
        return unicode(self.template)

