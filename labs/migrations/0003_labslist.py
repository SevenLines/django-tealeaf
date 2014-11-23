# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0003_auto_20140926_2347'),
        ('students', '0007_auto_20141121_0401'),
        ('labs', '0002_lab_task'),
    ]

    operations = [
        migrations.CreateModel(
            name='LabsList',
            fields=[
                ('cmsplugin_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='cms.CMSPlugin')),
                ('discipline', models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, to='students.Discipline', null=True)),
            ],
            options={
                'abstract': False,
            },
            bases=('cms.cmsplugin',),
        ),
    ]
