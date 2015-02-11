# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0011_student_sex'),
    ]

    operations = [
        migrations.AddField(
            model_name='discipline',
            name='visible',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='discipline',
            name='semestr',
            field=models.SmallIntegerField(default=2),
            preserve_default=True,
        ),
    ]
