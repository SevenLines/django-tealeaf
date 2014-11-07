# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'CustomCSS'
        db.create_table(u'custom_css_customcss', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=64)),
            ('css', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal(u'custom_css', ['CustomCSS'])


    def backwards(self, orm):
        # Deleting model 'CustomCSS'
        db.delete_table(u'custom_css_customcss')


    models = {
        u'custom_css.customcss': {
            'Meta': {'object_name': 'CustomCSS'},
            'css': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '64'})
        }
    }

    complete_apps = ['custom_css']