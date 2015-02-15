# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0013_auto_20150212_1710'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentLab',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(default=b'', max_length=100)),
                ('description', models.TextField(default=b'')),
                ('order', models.SmallIntegerField(default=0)),
                ('discipline', models.ForeignKey(to='students.Discipline')),
            ],
            options={
                'managed': True,
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='StudentTask',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('complexity', models.IntegerField(default=1, max_length=20, choices=[(0, b''), (1, b'easy'), (2, b'medium'), (3, b'hard'), (4, b'nightmare')])),
                ('description', models.TextField(default=b'')),
                ('order', models.SmallIntegerField(default=0)),
                ('lab', models.ForeignKey(to='students.StudentLab')),
            ],
            options={
                'managed': True,
            },
            bases=(models.Model,),
        ),
    ]
