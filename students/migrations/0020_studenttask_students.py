# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0019_studentlab_columns_count'),
    ]

    operations = [
        migrations.AddField(
            model_name='studenttask',
            name='students',
            field=models.ManyToManyField(to='students.Student'),
            preserve_default=True,
        ),
    ]
