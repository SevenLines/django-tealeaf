# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0010_auto_20141230_1458'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='sex',
            field=models.SmallIntegerField(default=-1, choices=[(0, b'woman'), (0, b'woman'), (1, b'man')]),
            preserve_default=True,
        ),
    ]
