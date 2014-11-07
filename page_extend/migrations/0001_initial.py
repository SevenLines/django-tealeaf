# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import filer.fields.image


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '__first__'),
        ('filer', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='PageExtend',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('authentication_required', models.BooleanField(default=False)),
                ('touchable', models.BooleanField(default=False)),
                ('extended_object', models.OneToOneField(editable=False, to='cms.Page')),
                ('image', filer.fields.image.FilerImageField(default=None, blank=True, to='filer.Image', null=True, verbose_name=b'image')),
                ('public_extension', models.OneToOneField(related_name='draft_extension', null=True, editable=False, to='page_extend.PageExtend')),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
    ]
