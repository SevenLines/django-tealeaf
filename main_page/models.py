from django.db import models
from django.db.models.base import Model
from solo.models import SingletonModel


class MainPageItem(Model):
    title = models.CharField(max_length=50)

    item_url = models.URLField(blank=True, null=True)
    local_path = models.FilePathField(blank=True, null=True)

    description = models.TextField(blank=True, null=True)


class MainPage(SingletonModel):
    current_item = models.ForeignKey(MainPageItem, null=True)