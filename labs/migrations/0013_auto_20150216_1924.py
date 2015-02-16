# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0004_auto_20150214_0824'),
        ('labs', '0012_auto_20141209_1455'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lab',
            name='discipline',
        ),
        migrations.RemoveField(
            model_name='lab',
            name='group',
        ),
        migrations.RemoveField(
            model_name='labex',
            name='cmsplugin_ptr',
        ),
        migrations.DeleteModel(
            name='LabEx',
        ),
        migrations.RemoveField(
            model_name='labslist',
            name='cmsplugin_ptr',
        ),
        migrations.RemoveField(
            model_name='labslist',
            name='discipline',
        ),
        migrations.RemoveField(
            model_name='labslist',
            name='group',
        ),
        migrations.DeleteModel(
            name='LabsList',
        ),
        migrations.RemoveField(
            model_name='task',
            name='lab',
        ),
        migrations.DeleteModel(
            name='Lab',
        ),
        migrations.RemoveField(
            model_name='taskex',
            name='cmsplugin_ptr',
        ),
        migrations.RemoveField(
            model_name='taskex',
            name='image',
        ),
        migrations.RemoveField(
            model_name='taskstudent',
            name='student',
        ),
        migrations.RemoveField(
            model_name='taskstudent',
            name='task',
        ),
        migrations.DeleteModel(
            name='Task',
        ),
        migrations.RemoveField(
            model_name='taskstudent',
            name='taskex',
        ),
        migrations.DeleteModel(
            name='TaskEx',
        ),
        migrations.DeleteModel(
            name='TaskStudent',
        ),
    ]
