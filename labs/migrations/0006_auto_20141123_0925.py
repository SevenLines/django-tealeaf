# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('labs', '0005_auto_20141123_0925'),
    ]

    operations = [
        migrations.RenameField(
            model_name='task',
            old_name='icomplexity',
            new_name='complexity',
        ),
    ]
