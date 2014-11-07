# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models
from students.models import Lesson


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Lesson.description_markup_type'
        db.add_column(u'students_lesson', 'description_markup_type',
                      self.gf('django.db.models.fields.CharField')(default='textile', max_length=30, blank=True),
                      keep_default=False)

        # Adding field 'Lesson._description_rendered'
        db.add_column(u'students_lesson', '_description_rendered',
                      self.gf('django.db.models.fields.TextField')(default=''),
                      keep_default=False)


        # Changing field 'Lesson.description'
        db.alter_column(u'students_lesson', 'description', self.gf('markupfield.fields.MarkupField')(rendered_field=True))

        for l in Lesson.objects.all():
            l.description.raw = l.description.raw.replace('<br>', '')
            l.save(force_update=True)

    def backwards(self, orm):
        # Deleting field 'Lesson.description_markup_type'
        db.delete_column(u'students_lesson', 'description_markup_type')

        # Deleting field 'Lesson._description_rendered'
        db.delete_column(u'students_lesson', '_description_rendered')


        # Changing field 'Lesson.description'
        db.alter_column(u'students_lesson', 'description', self.gf('django.db.models.fields.TextField')())

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
            'description_markup_type': ('django.db.models.fields.CharField', [], {'default': "'markdown'", 'max_length': '30', 'blank': 'True'}),
            'discipline': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['students.Discipline']"}),
            'group': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['students.Group']", 'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'lesson_type': ('django.db.models.fields.IntegerField', [], {'default': '1'})
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
            'group': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['students.Group']", 'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '50'}),
            'second_name': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '50'})
        }
    }

    complete_apps = ['students']