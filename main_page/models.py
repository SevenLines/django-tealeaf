import logging
import os
from subprocess import call
from django.core.files.storage import FileSystemStorage, Storage

from django.db import models
from django.db.models.base import Model
from django.db.models.fields import Field
from django.db.models.fields.files import FileField, FieldFile
from django.dispatch import receiver
from easy_thumbnails.alias import aliases
from easy_thumbnails.fields import ThumbnailerImageField
from easy_thumbnails.models import Thumbnail

logger = logging.getLogger(__name__)

class VideoFieldFile(FieldFile):

    def __init__(self, instance, field, name, *args, **kwargs):
        super(VideoFieldFile, self).__init__(instance, field, name)

    @property
    def thumbnail_path(self):
        return ''.join(self.path.split('.')[:-1]) + '.png'

    @property
    def thumbnail_name(self):
        return ''.join(self.name.split('.')[:-1]) + '.png'

    @property
    def thumbnail_url(self):
        return ''.join(self.url.split('.')[:-1]) + '.png'

    def save(self, name, content, save=True):
        super(VideoFieldFile, self).save(name,content,save=save)
        call(['ffmpeg', '-i', self.path, '-vframes', '1', self.thumbnail_path])

    def delete(self, save=True):
        self.storage.delete(self.thumbnail_name)
        super(VideoFieldFile, self).delete(save=save)



class VideoFileField(FileField):
    attr_class = VideoFieldFile


class MainPageItem(Model):
    # create thumbnailer alias
    if not aliases.get('main_page_thumb'):
        aliases.set('main_page_thumb', {'size': (160, 100)})

    title = models.CharField(max_length=50)
    img = ThumbnailerImageField(upload_to='main_page_items', default=None, null=True)
    video = VideoFileField(upload_to='main_page_items', default=None, null=True)
    description = models.TextField(blank=True, null=True)

    @property
    def dictionary(self):
        """
        return dictionary copy of object suitable for json response
        :return:
        """
        thumb_url = ""
        item_url = ""
        video_url = ""
        exists = False
        if self.img:
            exists = os.path.exists(self.img.path)
            try:
                thumb_url = self.img['main_page_thumb'].url
                item_url = self.img.url
            except Exception as e:
                thumb_url = ""
                item_url = ""
                logger.warning(e.message)
        elif self.video:
            exists = os.path.exists(self.video.path)
            try:
                thumb_url = self.video.thumbnail_url
                video_url = self.video.url
            except Exception as e:
                thumb_url = ""
                item_url = ""
                logger.warning(e.message)


        return {
            'id': self.pk,
            'title': self.title,
            'item_url': item_url,
            'video_url': video_url,
            'item_thumb_url': thumb_url
        }


class MainPage(Model):
    current_item = models.ForeignKey(MainPageItem, null=True, on_delete=models.SET_NULL)
    current_theme_css = models.TextField(default="")
    _img_bootstrap_cols = models.IntegerField(default=0)
    show_border = models.BooleanField(default=True)
    description = models.TextField(blank=True, null=True, default="")

    @property
    def img_bootstrap_cols(self):
        return min(max(self._img_bootstrap_cols, -1), 12)


    @staticmethod
    def solo():
        """
        returns singleton MainPage object, create it in db if necessary
        :return: MainPage
        :rtype: MainPage
        """
        if MainPage.objects.count() == 0:
            mp = MainPage()
            mp.save()
        return MainPage.objects.first()


@receiver(models.signals.post_delete, sender=MainPageItem)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """Deletes file from filesystem
    when corresponding `MainPageItem` object is deleted.
    """
    if instance.img:
        instance.img.delete(False)

    if instance.video:
        instance.video.delete(False)


@receiver(models.signals.pre_save, sender=MainPageItem)
def auto_delete_file_on_change(sender, instance, **kwargs):
    """Deletes file from filesystem
    when corresponding `MainPageItem` object is changed.
    """
    if not instance.pk:
        return False

    old_file = instance.img
    new_file = instance.img
    if old_file:
        if not old_file.path == new_file.path:
            if os.path.isfile(old_file.path):
                old_file.delete()

    new_file = instance.video
    old_file = instance.video
    if old_file:
        if not old_file.path == new_file.path:
            if os.path.isfile(old_file.path):
                old_file.delete()