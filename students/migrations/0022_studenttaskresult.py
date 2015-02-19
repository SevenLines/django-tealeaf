# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0021_studentlab_regular'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentTaskResult',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_create', models.DateTimeField(auto_now_add=True)),
                ('date_update', models.DateTimeField(auto_now=True)),
                ('mark', models.SmallIntegerField(default=1, choices=[(-1001, b'black-hole'), (-2, b'absent'), (0, b'empty'), (1, b'normal'), (2, b'good'), (3, b'excellent'), (4, b'awesome'), (5, b'fantastic'), (6, b'incredible'), (1001, b'shining'), (1002, b'mercy'), (1002, b'mercy')])),
                ('done', models.BooleanField(default=False)),
                ('student', models.ForeignKey(to='students.Student')),
                ('task', models.ForeignKey(to='students.StudentTask')),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
    ]
