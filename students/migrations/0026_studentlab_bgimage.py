# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import easy_thumbnails.fields


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0025_auto_20150425_0647'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentlab',
            name='bgimage',
            field=easy_thumbnails.fields.ThumbnailerImageField(default=None, null=True, upload_to=b'', blank=True),
            preserve_default=True,
        ),
    ]
