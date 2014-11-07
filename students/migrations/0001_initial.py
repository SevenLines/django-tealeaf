# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion
import markupfield.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Discipline',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(default=b'', max_length=50)),
                ('year', models.IntegerField(default=2014)),
                ('semestr', models.SmallIntegerField(default=1)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='DisciplineMarksCache',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('marks_json', models.TextField(default=b'')),
                ('marks_excel', models.BinaryField(null=True)),
                ('discipline', models.ForeignKey(default=None, to='students.Discipline', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(default=b'', max_length=10)),
                ('year', models.IntegerField(default=2014)),
                ('ancestor', models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, default=None, blank=True, to='students.Group', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Lesson',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('description', markupfield.fields.MarkupField(default=b'', blank=True)),
                ('description_markup_type', models.CharField(default=b'textile', max_length=30, editable=False, blank=True, choices=[(b'', b'--'), (b'html', b'html'), (b'plain', b'plain'), (b'markdown', b'markdown'), (b'restructuredtext', b'restructuredtext'), (b'textile', b'textile')])),
                ('_description_rendered', models.TextField(editable=False)),
                ('date', models.DateField(auto_now_add=True)),
                ('lesson_type', models.IntegerField(default=1, verbose_name=b'type', choices=[(1, b'\xd0\x9f\xd0\xb0\xd1\x80\xd0\xb0'), (2, b'\xd0\x9a\xd0\xbe\xd0\xbd\xd1\x82\xd1\x80\xd0\xbe\xd0\xbb\xd1\x8c\xd0\xbd\xd0\xb0\xd1\x8f'), (3, b'\xd0\xad\xd0\xba\xd0\xb7\xd0\xb0\xd0\xbc\xd0\xb5\xd0\xbd')])),
                ('multiplier', models.FloatField(default=1)),
                ('discipline', models.ForeignKey(to='students.Discipline')),
                ('group', models.ForeignKey(to='students.Group', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Mark',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('mark', models.SmallIntegerField(default=1, choices=[(-1001, b'black-hole'), (-2, b'absent'), (0, b'empty'), (1, b'normal'), (2, b'good'), (3, b'excellent'), (4, b'awesome'), (5, b'fantastic'), (1001, b'shining')])),
                ('lesson', models.ForeignKey(to='students.Lesson')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(default=b'', max_length=50)),
                ('second_name', models.CharField(default=b'', max_length=50)),
                ('phone', models.CharField(default=b'', max_length=50)),
                ('email', models.EmailField(default=b'', max_length=75)),
                ('vk', models.URLField(default=b'')),
                ('photo', models.ImageField(default=b'', max_length=255, upload_to=b'students')),
                ('group', models.ForeignKey(to='students.Group', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='mark',
            name='student',
            field=models.ForeignKey(to='students.Student'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='group',
            name='captain',
            field=models.ForeignKey(related_name='group_captain', on_delete=django.db.models.deletion.SET_NULL, default=None, to='students.Student', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='disciplinemarkscache',
            name='group',
            field=models.ForeignKey(default=None, to='students.Group', null=True),
            preserve_default=True,
        ),
    ]
