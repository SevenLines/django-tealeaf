# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0018_auto_20150214_1729'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentlab',
            name='columns_count',
            field=models.SmallIntegerField(default=1),
            preserve_default=True,
        ),
    ]
