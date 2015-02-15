# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0014_studentlab_studenttask'),
    ]

    operations = [
        migrations.AlterOrderWithRespectTo(
            name='studentlab',
            order_with_respect_to='discipline',
        ),
        migrations.RemoveField(
            model_name='studentlab',
            name='order',
        ),
        migrations.AlterOrderWithRespectTo(
            name='studenttask',
            order_with_respect_to='lab',
        ),
    ]
