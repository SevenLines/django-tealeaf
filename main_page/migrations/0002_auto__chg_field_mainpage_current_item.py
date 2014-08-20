# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'MainPage.current_item'
        db.alter_column(u'main_page_mainpage', 'current_item_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main_page.MainPageItem'], null=True))

    def backwards(self, orm):

        # Changing field 'MainPage.current_item'
        db.alter_column(u'main_page_mainpage', 'current_item_id', self.gf('django.db.models.fields.related.ForeignKey')(default=None, to=orm['main_page.MainPageItem']))

    models = {
        u'main_page.mainpage': {
            'Meta': {'object_name': 'MainPage'},
            'current_item': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main_page.MainPageItem']", 'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'main_page.mainpageitem': {
            'Meta': {'object_name': 'MainPageItem'},
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'item_url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'local_path': ('django.db.models.fields.FilePathField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        }
    }

    complete_apps = ['main_page']