# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0017_auto_20150214_1328'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='studenttask',
            options={'ordering': ['complexity', '_order', 'id']},
        ),
    ]
