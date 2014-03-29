from cms.models.pluginmodel import CMSPlugin
from django.db import models
from django.utils.translation import ugettext_lazy as _
from filer.fields.image import FilerImageField
from django.utils.text import Truncator


class LabEx(CMSPlugin):
    class Meta:
        pass

    TEXT = "labs/labex.html"
    GALLERY = "labs/labex_gallery.html"

    TYPE_CHOICES = (
        (TEXT, _("text")),
        (GALLERY, _("gallery")),
    )

    render_style = models.CharField(max_length=50,
                                    choices=TYPE_CHOICES,
                                    default=TEXT)

    title = models.CharField(max_length=200, blank=True, default="")
    description = models.TextField(blank=True, default="")
    image = FilerImageField(null=True, blank=True, default=None, verbose_name="image")

    def __unicode__(self):
        return unicode(self.title)


class TaskEx(CMSPlugin):

    UNDEFINED = ""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    NIGHTMARE = "nightmare"

    COMPLEX_CHOICES = (
        (UNDEFINED, _("")),
        (EASY, _("Easy")),
        (MEDIUM, _("Medium")),
        (HARD, _("Hard")),
        (NIGHTMARE, _("Nightmare")),
    )

    complexity = models.CharField(max_length=20,
                                  choices=COMPLEX_CHOICES,
                                  default=EASY)

    description = models.TextField(blank=True, default="")
    image = FilerImageField(null=True, blank=True, default=None, verbose_name="image")

    user = models.CharField(verbose_name="name of user",
                            max_length=100, blank=True, default="")

    def __unicode__(self):
        return unicode(self.user + " | " + Truncator(self.description).words(5, html=True))


