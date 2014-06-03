# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Mark'
        db.create_table(u'students_mark', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('student', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['students.Student'])),
            ('lesson', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['students.Lesson'])),
            ('mark', self.gf('django.db.models.fields.CharField')(default='', max_length=10)),
        ))
        db.send_create_signal(u'students', ['Mark'])

        # Adding model 'Lesson'
        db.create_table(u'students_lesson', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('discipline', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['students.Discipline'])),
            ('date', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal(u'students', ['Lesson'])

        # Adding model 'Discipline'
        db.create_table(u'students_discipline', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(default='', max_length=50)),
            ('year', self.gf('django.db.models.fields.IntegerField')(default=2013)),
            ('semestr', self.gf('django.db.models.fields.SmallIntegerField')(default=2)),
        ))
        db.send_create_signal(u'students', ['Discipline'])


        # Changing field 'Student.group'
        db.alter_column(u'students_student', 'group_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['students.Group'], null=True))

    def backwards(self, orm):
        # Deleting model 'Mark'
        db.delete_table(u'students_mark')

        # Deleting model 'Lesson'
        db.delete_table(u'students_lesson')

        # Deleting model 'Discipline'
        db.delete_table(u'students_discipline')


        # User chose to not deal with backwards NULL issues for 'Student.group'
        raise RuntimeError("Cannot reverse this migration. 'Student.group' and its values cannot be restored.")
        
        # The following code is provided here to aid in writing a correct migration
        # Changing field 'Student.group'
        db.alter_column(u'students_student', 'group_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['students.Group']))

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
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '10'}),
            'year': ('django.db.models.fields.IntegerField', [], {'default': '2013'})
        },
        u'students.lesson': {
            'Meta': {'object_name': 'Lesson'},
            'date': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'discipline': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['students.Discipline']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
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