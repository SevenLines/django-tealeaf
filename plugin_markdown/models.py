from cms.models.pluginmodel import CMSPlugin
from filer.fields.image import FilerImageField
from django.db import models
from markupfield.fields import MarkupField
from django.conf import settings


class MarkdownSnippet(CMSPlugin):
# add PLUGIN_MARKDOWN_CLASSES tuple to create new div class item
# ("choice_value", "choice_name")
    ALERT_INFO = 'alert alert-info'
    ALERT_WARNING = 'alert alert-warning'
    ALER_DANGER = 'alert alert-danger'
    ALERT_SUCCESS = 'alert alert-success'

    CLASSES = (
        (ALERT_INFO, ALERT_INFO),
        (ALERT_SUCCESS, ALERT_SUCCESS),
        (ALERT_WARNING, ALERT_WARNING),
        (ALER_DANGER, ALER_DANGER),
    )

    if hasattr(settings, "PLUGIN_MARKDOWN_CLASSES"):
        CLASSES += settings.PLUGIN_MARKDOWN_CLASSES


    body = MarkupField(default_markup_type='textile')
    image = FilerImageField(null=True, blank=True, default=None, verbose_name="image")
    body_class = models.CharField(editable=True, verbose_name="class", blank=True, max_length=255, choices=CLASSES, default="")

    def __unicode__(self):
        # path = u"<p>" + self.image.label if self.image else ""
        return unicode(self.body)
