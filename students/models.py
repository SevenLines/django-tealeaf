# Create your models here.
from django.db import models


class Group(models.Model):
    title = models.CharField(max_length=10)
    year = models.IntegerField()


class Student(models.Model):
    name = models.CharField(max_length=50)
    second_name = models.CharField(max_length=50)
    group = models.ForeignKey(Group)
