# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Wrapper',
            fields=[
                ('cmsplugin_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='cms.CMSPlugin')),
                ('template', models.CharField(default=b'wrapper/list.html', max_length=100, choices=[(b'wrapper/list.html', b'list'), (b'wrapper/block.html', b'div block')])),
                ('wrap_class', models.CharField(default=b'', max_length=255, blank=True, choices=[(b'list-group', b'list-group'), (b'text-center', b'text-center'), (b'main-banner', b'main-banner'), (b'items-list', b'items-list')])),
                ('item_class', models.CharField(default=b'', max_length=255, blank=True, choices=[(b'list-group-item', b'list-group-item')])),
            ],
            options={
                'abstract': False,
            },
            bases=('cms.cmsplugin',),
        ),
    ]
