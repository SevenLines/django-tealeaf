# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from students.models import DisciplineMarksCache


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0003_auto_20141107_0748'),
    ]

    operations = [
        migrations.RunPython(lambda a, s: DisciplineMarksCache.objects.all().delete()),
    ]
