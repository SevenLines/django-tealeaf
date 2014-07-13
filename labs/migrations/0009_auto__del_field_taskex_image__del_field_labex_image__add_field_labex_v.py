# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'TaskEx.image'
        db.delete_column(u'labs_taskex', 'image_id')

        # Deleting field 'LabEx.image'
        db.delete_column(u'labs_labex', 'image_id')

        # Adding field 'LabEx.visible'
        db.add_column(u'labs_labex', 'visible',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)


    def backwards(self, orm):
        # Adding field 'TaskEx.image'
        db.add_column(u'labs_taskex', 'image',
                      self.gf('django.db.models.fields.related.ForeignKey')(default=None, to=orm['filer.Image'], null=True, blank=True),
                      keep_default=False)

        # Adding field 'LabEx.image'
        db.add_column(u'labs_labex', 'image',
                      self.gf('django.db.models.fields.related.ForeignKey')(default=None, to=orm['filer.Image'], null=True, blank=True),
                      keep_default=False)

        # Deleting field 'LabEx.visible'
        db.delete_column(u'labs_labex', 'visible')


    models = {
        'cms.cmsplugin': {
            'Meta': {'object_name': 'CMSPlugin'},
            'changed_date': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'creation_date': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'language': ('django.db.models.fields.CharField', [], {'max_length': '15', 'db_index': 'True'}),
            'level': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'lft': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'parent': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['cms.CMSPlugin']", 'null': 'True', 'blank': 'True'}),
            'placeholder': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['cms.Placeholder']", 'null': 'True'}),
            'plugin_type': ('django.db.models.fields.CharField', [], {'max_length': '50', 'db_index': 'True'}),
            'position': ('django.db.models.fields.PositiveSmallIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'rght': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'tree_id': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'})
        },
        'cms.placeholder': {
            'Meta': {'object_name': 'Placeholder'},
            'default_width': ('django.db.models.fields.PositiveSmallIntegerField', [], {'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'slot': ('django.db.models.fields.CharField', [], {'max_length': '50', 'db_index': 'True'})
        },
        u'labs.labex': {
            'Meta': {'object_name': 'LabEx', '_ormbases': ['cms.CMSPlugin']},
            u'cmsplugin_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['cms.CMSPlugin']", 'unique': 'True', 'primary_key': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'default': "''", 'blank': 'True'}),
            'render_style': ('django.db.models.fields.CharField', [], {'default': "'labs/labex.html'", 'max_length': '50'}),
            'title': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'blank': 'True'}),
            'visible': ('django.db.models.fields.BooleanField', [], {'default': 'True'})
        },
        u'labs.taskex': {
            'Meta': {'object_name': 'TaskEx', '_ormbases': ['cms.CMSPlugin']},
            u'cmsplugin_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['cms.CMSPlugin']", 'unique': 'True', 'primary_key': 'True'}),
            'complexity': ('django.db.models.fields.CharField', [], {'default': "'easy'", 'max_length': '20'}),
            'description': ('django.db.models.fields.TextField', [], {'default': "'\\xd1\\x82\\xd0\\xb5\\xd0\\xba\\xd1\\x81\\xd1\\x82 \\xd0\\xb7\\xd0\\xb0\\xd0\\xb4\\xd0\\xb0\\xd1\\x87\\xd0\\xb8...'", 'blank': 'True'}),
            'user': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '100', 'blank': 'True'})
        }
    }

    complete_apps = ['labs']