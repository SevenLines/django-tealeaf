from django import forms
from django.db.models.base import Model
from django.db.models.fields import TextField, CharField
from cms.models import CMSPlugin


class Article(Model):
    title = CharField(max_length=100, default="")
    description = CharField(max_length=512, blank=True, default="")

    text = TextField(blank=True, default="")
    raw = TextField(blank=True, default="")

    def __unicode__(self):
        return u"%s:%s" % (self.title, self.text[:100])


class UploadImageFileForm(forms.Form):
    _file = forms.FileField(widget=forms.FileInput())
    pk = forms.IntegerField(widget=forms.HiddenInput(attrs={"class": "form-control"}))


class ArticlePluginModel(CMSPlugin):
    raw = TextField(blank=True, default="")

