# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0022_studenttaskresult'),
    ]

    operations = [
        migrations.AddField(
            model_name='studenttaskresult',
            name='date_create',
            field=models.DateTimeField(default=datetime.datetime(2015, 2, 19, 6, 8, 8, 756226, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='studenttaskresult',
            name='date_update',
            field=models.DateTimeField(default=datetime.datetime(2015, 2, 19, 6, 8, 14, 466492, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='studenttaskresult',
            name='mark',
            field=models.SmallIntegerField(default=1, choices=[(-1001, b'black-hole'), (-2, b'absent'), (0, b'empty'), (1, b'normal'), (2, b'good'), (3, b'excellent'), (4, b'awesome'), (5, b'fantastic'), (6, b'incredible'), (1001, b'shining'), (1002, b'mercy'), (1002, b'mercy')]),
            preserve_default=True,
        ),
    ]
