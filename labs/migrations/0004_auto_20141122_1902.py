# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('labs', '0003_labslist'),
    ]

    operations = [
        migrations.AddField(
            model_name='taskstudent',
            name='task',
            field=models.ForeignKey(to='labs.Task', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='taskstudent',
            name='student',
            field=models.ForeignKey(to='students.Student', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='taskstudent',
            name='taskex',
            field=models.ForeignKey(to='labs.TaskEx', null=True),
            preserve_default=True,
        ),
    ]
