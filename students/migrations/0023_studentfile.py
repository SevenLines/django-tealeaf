# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0022_studenttaskresult'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentFile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(default=b'', max_length=128)),
                ('description', models.TextField(default=b'')),
                ('content_type', models.CharField(default=b'', max_length=48)),
                ('blob', models.BinaryField(null=True)),
                ('student', models.ForeignKey(to='students.Student')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
