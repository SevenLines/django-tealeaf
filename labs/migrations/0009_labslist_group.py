# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0008_auto_20141128_1807'),
        ('labs', '0008_lab_group'),
    ]

    operations = [
        migrations.AddField(
            model_name='labslist',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, to='students.Group', null=True),
            preserve_default=True,
        ),
    ]
