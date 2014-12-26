# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from students.models.discipline import DisciplineMarksCache


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0005_auto_20141117_0417'),
    ]

    operations = [
        migrations.RunPython(lambda a, s: DisciplineMarksCache.objects.all().delete(),
                             lambda a, s: '')
    ]
