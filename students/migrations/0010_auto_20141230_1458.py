# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0009_lesson_icon'),
    ]

    operations = [
        migrations.AddField(
            model_name='mark',
            name='date_create',
            field=models.DateTimeField(default=datetime.datetime(2014, 12, 30, 14, 58, 20, 907751, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='mark',
            name='date_update',
            field=models.DateTimeField(default=datetime.datetime(2014, 12, 30, 14, 58, 31, 957635, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='lesson',
            name='lesson_type',
            field=models.IntegerField(default=1, verbose_name=b'type', choices=[(1, b'\xd0\x9f\xd1\x80\xd0\xb0\xd0\xba\xd1\x82\xd0\xb8\xd0\xba\xd0\xb0'), (2, b'\xd0\x9a\xd0\xbe\xd0\xbd\xd1\x82\xd1\x80\xd0\xbe\xd0\xbb\xd1\x8c\xd0\xbd\xd0\xb0\xd1\x8f'), (3, b'\xd0\x9b\xd0\xb5\xd0\xba\xd1\x86\xd0\xb8\xd1\x8f'), (4, b'\xd0\x9b\xd0\xb0\xd0\xb1\xd0\xbe\xd1\x80\xd0\xb0\xd1\x82\xd0\xbe\xd1\x80\xd0\xbd\xd0\xb0\xd1\x8f'), (5, b'\xd0\xad\xd0\xba\xd0\xb7\xd0\xb0\xd0\xbc\xd0\xb5\xd0\xbd')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='mark',
            name='mark',
            field=models.SmallIntegerField(default=1, choices=[(-1001, b'black-hole'), (-2, b'absent'), (0, b'empty'), (1, b'normal'), (2, b'good'), (3, b'excellent'), (4, b'awesome'), (5, b'fantastic'), (6, b'incredible'), (1001, b'shining'), (1002, b'mercy'), (1002, b'mercy')]),
            preserve_default=True,
        ),
    ]
