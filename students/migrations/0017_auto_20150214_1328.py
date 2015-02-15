# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0016_auto_20150214_0824'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='studentlab',
            options={'ordering': ['_order']},
        ),
        migrations.AlterModelOptions(
            name='studenttask',
            options={'ordering': ['_order']},
        ),
        migrations.AddField(
            model_name='studentlab',
            name='visible',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
