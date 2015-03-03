# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0023_studentfile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lesson',
            name='description_markup_type',
            field=models.CharField(default=b'textile', max_length=30, editable=False, blank=True, choices=[(b'', b'--'), (b'html', 'HTML'), (b'plain', 'Plain'), (b'markdown', 'Markdown'), (b'restructuredtext', 'Restructured Text'), (b'textile', 'Textile')]),
            preserve_default=True,
        ),
    ]
