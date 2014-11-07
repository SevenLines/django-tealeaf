# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion
import easy_thumbnails.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='MainPage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('current_theme_css', models.TextField(default=b'')),
                ('_img_bootstrap_cols', models.IntegerField(default=0)),
                ('show_border', models.BooleanField(default=True)),
                ('description', models.TextField(default=b'', null=True, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='MainPageItem',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=50)),
                ('img', easy_thumbnails.fields.ThumbnailerImageField(upload_to=b'main_page_items')),
                ('description', models.TextField(null=True, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='mainpage',
            name='current_item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, to='main_page.MainPageItem', null=True),
            preserve_default=True,
        ),
    ]
