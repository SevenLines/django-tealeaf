# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from students.models import DisciplineMarksCache


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0004_auto_20141108_1943'),
    ]

    operations = [
        migrations.AddField(
            model_name='lesson',
            name='score_ignore',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='lesson',
            name='lesson_type',
            field=models.IntegerField(default=1, verbose_name=b'type', choices=[(1, b'\xd0\x9f\xd0\xb0\xd1\x80\xd0\xb0'), (2, b'\xd0\x9a\xd0\xbe\xd0\xbd\xd1\x82\xd1\x80\xd0\xbe\xd0\xbb\xd1\x8c\xd0\xbd\xd0\xb0\xd1\x8f'), (3, b'\xd0\xad\xd0\xba\xd0\xb7\xd0\xb0\xd0\xbc\xd0\xb5\xd0\xbd'), (4, b'\xd0\x9b\xd0\xb0\xd0\xb1\xd0\xb0\xd1\x80\xd0\xb0\xd1\x82\xd0\xbe\xd1\x80\xd0\xbd\xd0\xb0\xd1\x8f')]),
            preserve_default=True,
        ),
        migrations.RunPython(
            lambda a, s: DisciplineMarksCache.objects.all().delete(),
            lambda a, s: a,
        )
    ]
