# -*- coding: utf-8 -*-
from south.db import db
from south.v2 import SchemaMigration


class Migration(SchemaMigration):
    def forwards(self, orm):
        try:
            db.rename_table('cmsplugin_cascadeelement', 'cmsplugin_cascade_cascadeelement')
        except:
            pass

    def backwards(self, orm):
        try:
            db.rename_table('cmsplugin_cascade_cascadeelement', 'cmsplugin_cascadeelement')
        except:
            pass

    models = {

    }

    complete_apps = ['upgrade']