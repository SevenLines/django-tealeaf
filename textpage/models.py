from cms.models.pagemodel import Page
from cms.models.pluginmodel import CMSPlugin
from django.db import models


# Create your models here.
from django.db.models.signals import post_delete
from django.dispatch.dispatcher import receiver
from easy_thumbnails.fields import ThumbnailerImageField
from filer.fields.image import FilerImageField


class TextPage(CMSPlugin):
    text = models.TextField(default="")


class TextPageImage(models.Model):
    image = ThumbnailerImageField(upload_to="textpage")


class TextPageFile(models.Model):
    file = models.FileField(upload_to="textpage/files")


@receiver(post_delete, sender=TextPageImage)
def mymodel_delete(sender, instance, **kwargs):
    if instance.image:
        instance.image.delete(False)


@receiver(post_delete, sender=TextPageFile)
def mymodel_delete(sender, instance, **kwargs):
    if instance.file:
        instance.file.delete(False)