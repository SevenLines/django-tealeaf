# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting model 'LessonType'
        db.delete_table(u'students_lessontype')


        # Renaming column for 'Lesson.lesson_type' to match new field type.
        db.rename_column(u'students_lesson', 'lesson_type_id', 'lesson_type')
        # Changing field 'Lesson.lesson_type'
        db.alter_column(u'students_lesson', 'lesson_type', self.gf('django.db.models.fields.IntegerField')())
        # Removing index on 'Lesson', fields ['lesson_type']
        db.delete_index(u'students_lesson', ['lesson_type_id'])


    def backwards(self, orm):
        # Adding index on 'Lesson', fields ['lesson_type']
        db.create_index(u'students_lesson', ['lesson_type_id'])

        # Adding model 'LessonType'
        db.create_table(u'students_lessontype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=50)),
        ))
        db.send_create_signal(u'students', ['LessonType'])


        # Renaming column for 'Lesson.lesson_type' to match new field type.
        db.rename_column(u'students_lesson', 'lesson_type', 'lesson_type_id')
        # Changing field 'Lesson.lesson_type'
        db.alter_column(u'students_lesson', 'lesson_type_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['students.LessonType'], null=True))

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
            'date': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '100', 'blank': 'True'}),
            'discipline': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['students.Discipline']"}),
            'group': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['students.Group']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lesson_type': ('django.db.models.fields.IntegerField', [], {'default': '1'})
        },
        u'students.mark': {
            'Meta': {'object_name': 'Mark'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lesson': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['students.Lesson']"}),
            'mark': ('django.db.models.fields.SmallIntegerField', [], {}),
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