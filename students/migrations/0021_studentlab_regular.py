# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0020_studenttask_students'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentlab',
            name='regular',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
