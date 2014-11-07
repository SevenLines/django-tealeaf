# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import filer.fields.image


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0001_initial'),
        ('cms', '0003_auto_20140926_2347'),
        ('filer', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='LabEx',
            fields=[
                ('cmsplugin_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='cms.CMSPlugin')),
                ('render_style', models.CharField(default=b'text', max_length=50, choices=[(b'text', 'text'), (b'gallery', 'gallery')])),
                ('visible', models.BooleanField(default=True)),
                ('title', models.CharField(default=b'', max_length=200, blank=True)),
                ('description', models.TextField(default=b'', blank=True)),
            ],
            options={
            },
            bases=('cms.cmsplugin',),
        ),
        migrations.CreateModel(
            name='TaskEx',
            fields=[
                ('cmsplugin_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='cms.CMSPlugin')),
                ('complexity', models.CharField(default=b'easy', max_length=20, choices=[(b'', ''), (b'easy', 'Easy'), (b'medium', 'Medium'), (b'hard', 'Hard'), (b'nightmare', 'Nightmare')])),
                ('description', models.TextField(default=b'\xd1\x82\xd0\xb5\xd0\xba\xd1\x81\xd1\x82 \xd0\xb7\xd0\xb0\xd0\xb4\xd0\xb0\xd1\x87\xd0\xb8...', blank=True)),
                ('image', filer.fields.image.FilerImageField(default=None, blank=True, to='filer.Image', null=True, verbose_name=b'image')),
            ],
            options={
                'abstract': False,
            },
            bases=('cms.cmsplugin',),
        ),
        migrations.CreateModel(
            name='TaskStudent',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('student', models.ForeignKey(to='students.Student')),
                ('taskex', models.ForeignKey(to='labs.TaskEx')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
