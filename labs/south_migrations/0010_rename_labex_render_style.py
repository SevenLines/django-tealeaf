from south.v2 import SchemaMigration

from labs.models import LabEx


class Migration(SchemaMigration):
    def forwards(self, orm):
        LabEx.objects.filter(render_style=u'labs/labex.html').update(render_style=u'text')
        LabEx.objects.filter(render_style=u'labs/labex_gallery.html').update(render_style=u'gallery')

    def backwards(self, orm):
        LabEx.objects.filter(render_style=u'text').update(render_style=u'labs/labex.html')
        LabEx.objects.filter(render_style=u'gallery').update(render_style=u'labs/labex_gallery.html')

