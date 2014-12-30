# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models
from students.models.discipline import DisciplineMarksCache


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Lesson.multiplier'
        db.add_column(u'students_lesson', 'multiplier',
                      self.gf('django.db.models.fields.FloatField')(default=1),
                      keep_default=False)
        DisciplineMarksCache.objects.all().delete()


    def backwards(self, orm):
        # Deleting field 'Lesson.multiplier'
        db.delete_column(u'students_lesson', 'multiplier')
        DisciplineMarksCache.objects.all().delete()


    models = {
        u'students.discipline': {
            'Meta': {'object_name': 'Discipline'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'semestr': ('django.db.models.fields.SmallIntegerField', [], {'default': '1'}),
            'title': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '50'}),
            'year': ('django.db.models.fields.IntegerField', [], {'default': '2014'})
        },
        u'students.disciplinemarkscache': {
            'Meta': {'object_name': 'DisciplineMarksCache'},
            'discipline': ('django.db.models.fields.related.ForeignKey', [], {'default': 'None', 'to': u"orm['students.Discipline']", 'null': 'True'}),
            'group': ('django.db.models.fields.related.ForeignKey', [], {'default': 'None', 'to': u"orm['students.Group']", 'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'marks_json': ('django.db.models.fields.TextField', [], {'default': "''"})
        },
        u'students.group': {
            'Meta': {'object_name': 'Group'},
            'ancestor': ('django.db.models.fields.related.ForeignKey', [], {'default': 'None', 'to': u"orm['students.Group']", 'null': 'True', 'on_delete': 'models.SET_NULL', 'blank': 'True'}),
            'captain': ('django.db.models.fields.related.ForeignKey', [], {'default': 'None', 'related_name': "'group_captain'", 'null': 'True', 'on_delete': 'models.SET_NULL', 'to': u"orm['students.Student']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '10'}),
            'year': ('django.db.models.fields.IntegerField', [], {'default': '2014'})
        },
        u'students.lesson': {
            'Meta': {'object_name': 'Lesson'},
            '_description_rendered': ('django.db.models.fields.TextField', [], {}),
            'date': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'description': ('markupfield.fields.MarkupField', [], {'default': "''", 'rendered_field': 'True', 'blank': 'True'}),
            'description_markup_type': ('django.db.models.fields.CharField', [], {'default': "'textile'", 'max_length': '30', 'blank': 'True'}),
            'discipline': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['students.Discipline']"}),
            'group': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['students.Group']", 'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lesson_type': ('django.db.models.fields.IntegerField', [], {'default': '1'}),
            'multiplier': ('django.db.models.fields.FloatField', [], {'default': '1'})
        },
        u'students.mark': {
            'Meta': {'object_name': 'Mark'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lesson': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['students.Lesson']"}),
            'mark': ('django.db.models.fields.SmallIntegerField', [], {'default': '0'}),
            'student': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['students.Student']"})
        },
        u'students.student': {
            'Meta': {'object_name': 'Student'},
            'email': ('django.db.models.fields.EmailField', [], {'default': "''", 'max_length': '75'}),
            'group': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['students.Group']", 'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '50'}),
            'phone': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '50'}),
            'second_name': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '50'}),
            'vk': ('django.db.models.fields.URLField', [], {'default': "''", 'max_length': '200'})
        }
    }

    complete_apps = ['students']