# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        db.rename_table('cmsplugin_filerimage', 'cmsplugin_filer_image_filerimage')
        db.rename_table('cmsplugin_filerfile', 'cmsplugin_filer_file_filerfile')
        # db.rename_table('cmsplugin_cascadeelement', 'cmsplugin_cascade_cascadeelement')

    def backwards(self, orm):
        db.rename_table('cmsplugin_filer_image_filerimage', 'cmsplugin_filerimage')
        db.rename_table('cmsplugin_filer_file_filerfile', 'cmsplugin_filerfile')
        # db.rename_table('cmsplugin_cascade_cascadeelement', 'cmsplugin_cascadeelement')

    models = {
        
    }

    complete_apps = ['upgrade']