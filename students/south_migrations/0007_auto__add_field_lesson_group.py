# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models
from students.models.group import Group


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Lesson.group'
        db.add_column(u'students_lesson', 'group',
                      self.gf('django.db.models.fields.related.ForeignKey')(default=Group.objects.first().id, to=orm['students.Group']),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'Lesson.group'
        db.delete_column(u'students_lesson', 'group_id')


    models = {
        u'students.discipline': {
            'Meta': {'object_name': 'Discipline'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'semestr': ('django.db.models.fields.SmallIntegerField', [], {'default': '2'}),
            'title': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '50'}),
            'year': ('django.db.models.fields.IntegerField', [], {'default': '2013'})
        },
        u'students.group': {
            'Meta': {'object_name': 'Group'},
            'ancestor': ('django.db.models.fields.related.ForeignKey', [], {'default': 'None', 'to': u"orm['students.Group']", 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '10'}),
            'year': ('django.db.models.fields.IntegerField', [], {'default': '2013'})
        },
        u'students.lesson': {
            'Meta': {'object_name': 'Lesson'},
            'date': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'discipline': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['students.Discipline']"}),
            'group': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['students.Group']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lesson_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['students.LessonType']", 'null': 'True', 'blank': 'True'})
        },
        u'students.lessontype': {
            'Meta': {'object_name': 'LessonType'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'students.mark': {
            'Meta': {'object_name': 'Mark'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lesson': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['students.Lesson']"}),
            'mark': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '10'}),
            'student': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['students.Student']"})
        },
        u'students.student': {
            'Meta': {'object_name': 'Student'},
            'group': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['students.Group']", 'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '50'}),
            'second_name': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '50'})
        }
    }

    complete_apps = ['students']