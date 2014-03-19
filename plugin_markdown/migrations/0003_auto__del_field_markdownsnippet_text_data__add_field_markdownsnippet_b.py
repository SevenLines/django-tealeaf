# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'MarkdownSnippet.text_data'
        db.delete_column(u'plugin_markdown_markdownsnippet', 'text_data')

        # Adding field 'MarkdownSnippet.body'
        db.add_column(u'plugin_markdown_markdownsnippet', 'body',
                      self.gf('markupfield.fields.MarkupField')(default='', rendered_field=True),
                      keep_default=False)

        # Adding field 'MarkdownSnippet.body_markup_type'
        db.add_column(u'plugin_markdown_markdownsnippet', 'body_markup_type',
                      self.gf('django.db.models.fields.CharField')(default='textile', max_length=30),
                      keep_default=False)

        # Adding field 'MarkdownSnippet._body_rendered'
        db.add_column(u'plugin_markdown_markdownsnippet', '_body_rendered',
                      self.gf('django.db.models.fields.TextField')(default=''),
                      keep_default=False)


    def backwards(self, orm):
        # Adding field 'MarkdownSnippet.text_data'
        db.add_column(u'plugin_markdown_markdownsnippet', 'text_data',
                      self.gf('django.db.models.fields.TextField')(default='', blank='True'),
                      keep_default=False)

        # Deleting field 'MarkdownSnippet.body'
        db.delete_column(u'plugin_markdown_markdownsnippet', 'body')

        # Deleting field 'MarkdownSnippet.body_markup_type'
        db.delete_column(u'plugin_markdown_markdownsnippet', 'body_markup_type')

        # Deleting field 'MarkdownSnippet._body_rendered'
        db.delete_column(u'plugin_markdown_markdownsnippet', '_body_rendered')


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
        u'plugin_markdown.markdownsnippet': {
            'Meta': {'object_name': 'MarkdownSnippet', '_ormbases': ['cms.CMSPlugin']},
            '_body_rendered': ('django.db.models.fields.TextField', [], {}),
            'body': ('markupfield.fields.MarkupField', [], {'rendered_field': 'True'}),
            'body_markup_type': ('django.db.models.fields.CharField', [], {'default': "'textile'", 'max_length': '30'}),
            u'cmsplugin_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['cms.CMSPlugin']", 'unique': 'True', 'primary_key': 'True'})
        }
    }

    complete_apps = ['plugin_markdown']