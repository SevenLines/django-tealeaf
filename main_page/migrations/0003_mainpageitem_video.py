# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import main_page.models


class Migration(migrations.Migration):

    dependencies = [
        ('main_page', '0002_auto_20150303_1705'),
    ]

    operations = [
        migrations.AddField(
            model_name='mainpageitem',
            name='video',
            field=main_page.models.VideoFileField(default=None, null=True, upload_to=b'main_page_items'),
            preserve_default=True,
        ),
    ]
