"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""
from cms.api import create_page
from django.contrib.auth.models import User

from django.test import TestCase
from toc.cms_plugins import TocPlugin


class TocPluginTests(TestCase):
    pass