# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0002_auto_20141107_0739'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='group',
            name='erudition',
        ),
        migrations.RemoveField(
            model_name='group',
            name='kindness',
        ),
    ]
