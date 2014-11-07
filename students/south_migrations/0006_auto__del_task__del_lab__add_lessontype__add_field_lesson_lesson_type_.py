# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting model 'Task'
        db.delete_table(u'students_task')

        # Deleting model 'Lab'
        db.delete_table(u'students_lab')

        # Adding model 'LessonType'
        db.create_table(u'students_lessontype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=50)),
        ))
        db.send_create_signal(u'students', ['LessonType'])

        # Adding field 'Lesson.lesson_type'
        db.add_column(u'students_lesson', 'lesson_type',
                      self.gf('django.db.models.fields.related.ForeignKey')(to=orm['students.LessonType'], null=True, blank=True),
                      keep_default=False)


        # Changing field 'Lesson.date'
        db.alter_column(u'students_lesson', 'date', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True))

    def backwards(self, orm):
        # Adding model 'Task'
        db.create_table(u'students_task', (
            ('complexity', self.gf('django.db.models.fields.CharField')(default='easy', max_length=20)),
            ('description', self.gf('django.db.models.fields.TextField')(default='', blank=True)),
            ('lab', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['students.Lab'])),
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
        ))
        db.send_create_signal(u'students', ['Task'])

        # Adding model 'Lab'
        db.create_table(u'students_lab', (
            ('discipline', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['students.Discipline'])),
            ('title', self.gf('django.db.models.fields.CharField')(default='', max_length=200, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(default='', blank=True)),
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
        ))
        db.send_create_signal(u'students', ['Lab'])

        # Deleting model 'LessonType'
        db.delete_table(u'students_lessontype')

        # Deleting field 'Lesson.lesson_type'
        db.delete_column(u'students_lesson', 'lesson_type_id')


        # Changing field 'Lesson.date'
        db.alter_column(u'students_lesson', 'date', self.gf('django.db.models.fields.DateField')())

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