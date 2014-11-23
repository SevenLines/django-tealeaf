# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0007_auto_20141121_0401'),
        ('labs', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Lab',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('order', models.PositiveIntegerField(editable=False, db_index=True)),
                ('visible', models.BooleanField(default=True)),
                ('description', models.TextField(default=b'', blank=True)),
                ('title', models.CharField(default=b'', max_length=200, blank=True)),
                ('discipline', models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, to='students.Discipline', null=True)),
            ],
            options={
                'ordering': ('order',),
                'abstract': False,
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('order', models.PositiveIntegerField(editable=False, db_index=True)),
                ('complexity', models.CharField(default=b'easy', max_length=20, choices=[(b'', ''), (b'easy', 'Easy'), (b'medium', 'Medium'), (b'hard', 'Hard'), (b'nightmare', 'Nightmare')])),
                ('description', models.TextField(default=b'', blank=True)),
                ('lab', models.ForeignKey(to='labs.Lab')),
            ],
            options={
                'ordering': ('order',),
                'abstract': False,
            },
            bases=(models.Model,),
        ),
    ]
