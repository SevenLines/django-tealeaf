# Create your models here.
from datetime import date
from django.db import models


class Group(models.Model):
    title = models.CharField(max_length=10, default='')
    year = models.IntegerField(default=date.today().year)

    def __unicode__(self):
        return "%s | %s" % (self.year, self.title)


class Student(models.Model):
    name = models.CharField(max_length=50, default='')
    second_name = models.CharField(max_length=50, default='')
    group = models.ForeignKey(Group, null=True)
    def __unicode__(self):
        return "%s | %s" % (self.second_name, self.name)
