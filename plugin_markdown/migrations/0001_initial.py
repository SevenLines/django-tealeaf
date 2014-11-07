# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import filer.fields.image
import markupfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '__first__'),
        ('filer', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='MarkdownSnippet',
            fields=[
                ('cmsplugin_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='cms.CMSPlugin')),
                ('body', markupfield.fields.MarkupField(default=b'', blank=True)),
                ('body_markup_type', models.CharField(default=b'textile', max_length=30, blank=True, choices=[(b'', b'--'), (b'html', b'html'), (b'plain', b'plain'), (b'markdown', b'markdown'), (b'restructuredtext', b'restructuredtext'), (b'textile', b'textile')])),
                ('_body_rendered', models.TextField(editable=False)),
                ('body_class', models.CharField(default=b'', max_length=255, verbose_name=b'wrap class', blank=True, choices=[(b'alert alert-info', b'alert alert-info'), (b'alert alert-success', b'alert alert-success'), (b'alert alert-warning', b'alert alert-warning'), (b'alert alert-danger', b'alert alert-danger')])),
                ('body_wrap_tag', models.CharField(default=b'div', max_length=20, verbose_name=b'wrap tag', blank=True, choices=[(b'div', b'div')])),
                ('image', filer.fields.image.FilerImageField(default=None, blank=True, to='filer.Image', null=True, verbose_name=b'image')),
            ],
            options={
                'abstract': False,
            },
            bases=('cms.cmsplugin',),
        ),
    ]
