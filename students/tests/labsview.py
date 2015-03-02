from django.core.urlresolvers import reverse
from django.test import TestCase


class LabsViewTestCase(TestCase):
    def index_should_response(self):
        self.client.get(reverse('students.views.labsview.index'))
