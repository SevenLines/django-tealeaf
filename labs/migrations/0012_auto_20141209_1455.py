# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('labs', '0011_labslist_show_users'),
    ]

    operations = [
        migrations.AlterField(
            model_name='labslist',
            name='show_users',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
    ]
