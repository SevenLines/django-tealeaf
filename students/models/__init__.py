# coding: utf-8
# Create your models here.
import StringIO
import io
import json

from django.db import models, transaction
from django.db.models.signals import post_delete, post_save
from django.db.transaction import atomic
from django.dispatch.dispatcher import receiver
from django.forms import model_to_dict
from django.http import HttpResponse
from filer.fields.image import FilerImageField
from markupfield.fields import MarkupField
from colour import Color
import xlsxwriter
from app.utils import json_encoder
from students.models.group import Group
import students.utils
from students.utils import current_year

def active_years(r=2):
    """
    returns list of active years like current year +-r
    :param r: range from current year [-r, r]
    :return:
    """
    years = Group.objects.all().values_list('year').distinct()
    if len(years) == 0:
        years = [current_year(), ]
    else:
        years = list(zip(*years)[0])

    _min = min(years)
    _max = max(years)
    for i in xrange(1, r + 1):
        years.insert(0, _min - i)
    for i in xrange(1, r + 1):
        years.append(_max + i)
    years.sort()
    return years

