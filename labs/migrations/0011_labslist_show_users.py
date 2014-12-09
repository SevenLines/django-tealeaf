# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('labs', '0010_auto_20141202_1636'),
    ]

    operations = [
        migrations.AddField(
            model_name='labslist',
            name='show_users',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
