# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import filer.fields.image


class Migration(migrations.Migration):

    dependencies = [
        ('filer', '__first__'),
        ('students', '0008_auto_20141128_1807'),
    ]

    operations = [
        migrations.AddField(
            model_name='lesson',
            name='icon',
            field=filer.fields.image.FilerImageField(default=None, blank=True, to='filer.Image', null=True),
            preserve_default=True,
        ),
    ]
