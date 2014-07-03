# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Task'
        db.create_table(u'students_task', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('lab', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['students.Lab'])),
            ('description', self.gf('django.db.models.fields.TextField')(default='', blank=True)),
            ('complexity', self.gf('django.db.models.fields.CharField')(default='easy', max_length=20)),
        ))
        db.send_create_signal(u'students', ['Task'])

        # Adding model 'Lab'
        db.create_table(u'students_lab', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(default='', max_length=200, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(default='', blank=True)),
            ('discipline', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['students.Discipline'])),
        ))
        db.send_create_signal(u'students', ['Lab'])


    def backwards(self, orm):
        # Deleting model 'Task'
        db.delete_table(u'students_task')

        # Deleting model 'Lab'
        db.delete_table(u'students_lab')


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
        u'students.lab': {
            'Meta': {'object_name': 'Lab'},
            'description': ('django.db.models.fields.TextField', [], {'default': "''", 'blank': 'True'}),
            'discipline': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['students.Discipline']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'blank': 'True'})
        },
        u'students.lesson': {
            'Meta': {'object_name': 'Lesson'},
            'date': ('django.db.models.fields.DateField', [], {'default': 'datetime.datetime(2014, 6, 14, 0, 0)'}),
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
        },
        u'students.task': {
            'Meta': {'object_name': 'Task'},
            'complexity': ('django.db.models.fields.CharField', [], {'default': "'easy'", 'max_length': '20'}),
            'description': ('django.db.models.fields.TextField', [], {'default': "''", 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lab': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['students.Lab']"})
        }
    }

    complete_apps = ['students']