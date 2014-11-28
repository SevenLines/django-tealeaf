# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0007_auto_20141121_0401'),
    ]

    operations = [
        migrations.AlterIndexTogether(
            name='disciplinemarkscache',
            index_together=set([('discipline', 'group')]),
        ),
    ]
