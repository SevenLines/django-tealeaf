# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0008_auto_20141128_1807'),
        ('labs', '0007_auto_20141123_1004'),
    ]

    operations = [
        migrations.AddField(
            model_name='lab',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, default=None, to='students.Group', null=True),
            preserve_default=True,
        ),
    ]
