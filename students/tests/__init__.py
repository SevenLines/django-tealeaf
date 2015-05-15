__author__ = 'm'

from test_labsview import *


class TestStudentsCase(MyTestCase):

    @staticmethod
    def as_admin(fn):
        def _wrapper(self=None):
            self.client.login(username=self.admin, password="12345")
            fn(self)
            self.client.logout()

        return _wrapper

    def setUp(self):
        super(TestStudentsCase, self).setUp()
        self.admin = User.objects.create_user(username="students_admin", password="12345")
        self.admin.profile.is_admin = True
        self.admin.profile.save()
