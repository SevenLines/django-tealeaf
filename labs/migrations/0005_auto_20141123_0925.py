# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('labs', '0004_auto_20141122_1902'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='complexity',
        ),
        migrations.AddField(
            model_name='task',
            name='icomplexity',
            field=models.IntegerField(default=1, max_length=20, choices=[(0, b''), (1, b'easy'), (2, b'medium'), (3, b'hard'), (4, b'nightmare')]),
            preserve_default=True,
        ),
    ]
