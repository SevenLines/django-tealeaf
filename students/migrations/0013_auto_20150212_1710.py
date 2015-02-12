# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0012_auto_20150211_1040'),
    ]

    operations = [
        migrations.AlterField(
            model_name='discipline',
            name='visible',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
