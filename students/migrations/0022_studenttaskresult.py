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
                ('done', models.BooleanField(default=False)),
                ('student', models.ForeignKey(to='students.Student')),
                ('task', models.ForeignKey(to='students.StudentTask')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
