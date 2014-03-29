"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""
from cms.api import create_page, add_plugin
from django.contrib.auth.models import User
from labs.cms_plugins import TaskExPlugin

from django.test import TestCase
from labs.models import TaskEx


# class TaskTests(TestCase):
#     def create_superuser(self):
#         self.superuser = User.objects.create_superuser('root', 'mmailm@mail.ru', '12345')
#         return self.superuser
#
#     def create_page(self, title, template='lesson_article.html'):
#         page = create_page(title, template, 'en', created_by=self.superuser, published=True)
#         return page
#
#     def setUp(self):
#         self.create_superuser()
#         self.page = self.create_page('task_test')
#         placeholder = self.page.placeholders.get(slot='content')
#         plugin = add_plugin(placeholder, 'TaskExPlugin', 'en',
#                             position='last-child',
#                             target=None,
#                             complexity=TaskEx.EASY,
#                             description='Some task',)
#
#         assert isinstance(plugin.model, TaskExPlugin)
#
#     def test_has_description(self):
#         self.assertEqual(1+1, 2)


