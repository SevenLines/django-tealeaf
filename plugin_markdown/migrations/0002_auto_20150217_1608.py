# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('plugin_markdown', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='markdownsnippet',
            name='cmsplugin_ptr',
        ),
        migrations.RemoveField(
            model_name='markdownsnippet',
            name='image',
        ),
        migrations.DeleteModel(
            name='MarkdownSnippet',
        ),
    ]
