"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""
from django.contrib.auth.models import User

from django.core.urlresolvers import reverse
from django.test import TestCase

from labs import views as lv


class TestViews(TestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser('admin', 'mmailm@mail.ru', '12345')

    def can_access(self, url, methods=('post', 'get')):
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 302 if 'get' in methods else 405)

        resp = self.client.post(url)
        self.assertEqual(resp.status_code, 302 if 'post' in methods else 405)

        self.client.login(username='admin', password='12345')

        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 400 if 'get' in methods else 405)

        resp = self.client.post(url)
        self.assertEqual(resp.status_code, 400 if 'post' in methods else 405)

        self.client.logout()

    def test_update_task(self):
        self.can_access(reverse(lv.update_task, args=(0,)), methods=('post',))

    def test_add_task(self):
        self.can_access(reverse(lv.add_task, args=(0,)), methods=('post',))

    def test_update_lab(self):
        self.can_access(reverse(lv.update_lab, args=(0,)), methods=('post',))