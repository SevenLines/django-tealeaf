from unittest import TestCase
from django.core.urlresolvers import reverse
from django.test import Client
from students.models import Group

__author__ = 'mick'


class TestIndex(TestCase):
    def test_response(self):
        c = Client()
        r = c.post(reverse("students.views.ajax.index"))
        self.assertEqual(r.status_code, 200)

        g = Group(title="1234", year="2013")
        g.save()

        c = Client()
        r = c.post(reverse("students.views.ajax.index"))
        self.assertEqual(r.status_code, 200)

        g.delete()