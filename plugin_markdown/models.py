from cms.models.pluginmodel import CMSPlugin
from filer.fields.image import FilerImageField
from django.db import models
from markupfield.fields import MarkupField
from django.conf import settings
from django.utils.text import Truncator


class MarkdownSnippet(CMSPlugin):
# add PLUGIN_MARKDOWN_CLASSES tuple array to create new div class item
# like: ("choice_value", "choice_name")
    GOOGLE_PRETTIFY = 'prettyprint linenums'
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

    DIV = 'div'
    PRE = 'pre'

    TAGS = (
        (DIV, DIV),
    )

    if hasattr(settings, "PLUGIN_MARKDOWN_CLASSES"):
        CLASSES += settings.PLUGIN_MARKDOWN_CLASSES


    body = MarkupField(default_markup_type='textile', blank=True, default='')
    image = FilerImageField(null=True, blank=True, default=None, verbose_name="image")

    body_class = models.CharField(editable=True,
                                  verbose_name="wrap class",
                                  blank=True,
                                  max_length=255,
                                  choices=CLASSES,
                                  default="")

    body_wrap_tag = models.CharField(editable=True,
                                     verbose_name="wrap tag",
                                     blank=True,
                                     max_length=20,
                                     choices=TAGS,
                                     default=DIV)

    # inner_placeholder = PlaceholderField('inner_placeholder')

    def __unicode__(self):
        # path = u"<p>" + self.image.label if self.image else ""
        return unicode(Truncator(self.body).words(10, html=True))
