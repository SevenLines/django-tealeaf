from django.db import models
from django.db.models.base import Model


class MainPageItem(Model):
    title = models.CharField(max_length=50)

    item_url = models.URLField(blank=True, null=True)
    local_path = models.FilePathField(blank=True, null=True)

    description = models.TextField(blank=True, null=True)


class MainPage(Model):
    current_item = models.ForeignKey(MainPageItem, null=True, on_delete=models.SET_NULL)

    @staticmethod
    def solo():
        if MainPage.objects.count() == 0:
            mp = MainPage()
            mp.save()
        return MainPage.objects.get()