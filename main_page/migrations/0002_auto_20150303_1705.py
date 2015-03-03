# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import easy_thumbnails.fields


class Migration(migrations.Migration):

    dependencies = [
        ('main_page', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mainpageitem',
            name='img',
            field=easy_thumbnails.fields.ThumbnailerImageField(default=None, null=True, upload_to=b'main_page_items'),
            preserve_default=True,
        ),
    ]
