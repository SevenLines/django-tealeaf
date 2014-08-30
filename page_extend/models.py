# coding=utf-8
from filer.fields.image import FilerImageField
from cms.extensions import PageExtension
from cms.extensions import extension_pool
from django.db import models


class PageExtend(PageExtension):
    image = FilerImageField(null=True, blank=True, default=None, verbose_name="image")
    authentication_required = models.BooleanField(default=False)
    touchable = models.BooleanField(
        default=False)  # если true то элемент меню будет реагировать касание тачскрина как на клик мыши


extension_pool.register(PageExtend)


