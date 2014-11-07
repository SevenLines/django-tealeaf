# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='group',
            name='erudition',
            field=models.FloatField(default=1),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='group',
            name='kindness',
            field=models.FloatField(default=1),
            preserve_default=True,
        ),
    ]
