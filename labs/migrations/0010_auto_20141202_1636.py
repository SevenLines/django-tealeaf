# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('labs', '0009_labslist_group'),
    ]

    operations = [
        migrations.AlterField(
            model_name='labslist',
            name='discipline',
            field=models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, blank=True, to='students.Discipline', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='labslist',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, blank=True, to='students.Group', null=True),
            preserve_default=True,
        ),
    ]
