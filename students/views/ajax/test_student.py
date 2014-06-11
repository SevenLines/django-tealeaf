from unittest import TestCase

from django.contrib.auth.models import User

from django.core.urlresolvers import reverse

from django.test.client import Client

from students.models import Group, Student
from students.views.ajax.student import add, index, remove


__author__ = 'mick'


def create_admin():
    return User.objects.create_superuser('admin', 'mmailm@mail.ru', '12345')


class TestAdd(TestCase):
    @classmethod
    def setUpClass(cls):
        super(TestAdd, cls).setUpClass()
        cls.group = Group.objects.first()
        cls.group = Group(title='2211', year=2013)
        cls.group.save()
        cls.admin = create_admin()
        cls.student = Student(name="Mick", second_name="Good", group=cls.group)
        cls.student.save()

        cls.good_data_without_student_id = {
            'name': 'Mick',
            'second_name': 'Nice',
            'year': -100,
            'group_id': cls.group.pk,
        }

        cls.good_data_with_student_id = {
            'name': 'Mick',
            'second_name': 'Nice',
            'year': -100,
            'group_id': cls.group.pk,
            'student_id': cls.student.pk,
        }

        cls.bad_data = {
            'name': 'Mick',
            'second_name': 'Nice',
            'year': -100,
            'group_id': -1,
        }


    @classmethod
    def tearDownClass(cls):
        super(TestAdd, cls).tearDownClass()
        cls.admin.delete()
        cls.group.delete()
        cls.student.delete()

    def login(self, client):
        client.login(username='admin', password='12345')

    def test_unlogged(self):
        c = Client()
        r = c.post(reverse(add))
        self.assertEquals(r.status_code, 302)

    def test_post_with_bad_data(self):
        c = Client()
        self.login(c)
        r = c.post(reverse(add), self.bad_data)
        self.assertEqual(r.status_code, 404)

    def test_post_with_good_data(self):
        c = Client()
        self.login(c)

        students_count_before = Student.objects.count()
        r = c.post(reverse(add), self.good_data_with_student_id)
        self.assertEqual(r.status_code, 200)
        students_count_after = Student.objects.count()
        self.assertEquals(students_count_before, students_count_after)

        students_count_before = Student.objects.count()
        r = c.post(reverse(add), self.good_data_without_student_id)
        self.assertEqual(r.status_code, 200)
        students_count_after = Student.objects.count()
        self.assertEquals(students_count_before + 1, students_count_after)

    def test_get(self):
        c = Client()
        r = c.post(reverse(add), {})
        self.assertEqual(r.status_code, 302)


class TestIndex(TestCase):
    @classmethod
    def setUpClass(cls):
        super(TestIndex, cls).setUpClass()
        cls.group = Group.objects.first()
        cls.group = Group(title='2211', year=2013)
        cls.group.save()
        cls.admin = create_admin()
        cls.url = reverse(index)

    @classmethod
    def tearDownClass(cls):
        super(TestIndex, cls).tearDownClass()
        cls.admin.delete()
        cls.group.delete()

    def test_get_without_data(self):
        c = Client()
        r = c.get(self.url)
        self.assertEquals(r.status_code, 404)

    def test_get_with_data(self):
        c = Client()
        r = c.get(self.url, {
            'group_id': 1,
        })
        self.assertEquals(r.status_code, 404)

    def test_post_without_data(self):
        c = Client()
        r = c.post(self.url)
        self.assertEquals(r.status_code, 404)

    def test_post_with_wrong_group_id(self):
        c = Client()
        r = c.post(self.url, {
            'group_id': -1,
        })
        self.assertEquals(r.status_code, 404)

    def test_post_with_good_id(self):
        c = Client()
        r = c.post(self.url, {
            'group_id': self.group.pk,
        })
        self.assertEquals(r.status_code, 200)


class TestRemove(TestCase):
    #@classmethod
    def setUp(cls):
        #super(TestRemove, cls).setUpClass()
        cls.group = Group.objects.first()
        cls.group = Group(title='2211', year=2013)
        cls.group.save()
        cls.admin = create_admin()
        cls.student = Student(name="Mick", second_name="Good", group=cls.group)
        cls.student.save()
        cls.good_data = {
            'student_id': cls.student.pk,
        }
        cls.bad_data = {
            'student_id': -1,
        }

    #@classmethod
    def tearDown(cls):
        #super(TestRemove, cls).tearDownClass()
        cls.admin.delete()
        cls.group.delete()
        cls.student.delete()


    def test_logged(self):
        c = Client()
        r = c.post(reverse(remove), self.good_data)
        self.assertEquals(r.status_code, 302)

        c = Client()
        r = c.post(reverse(remove), self.bad_data)
        self.assertEquals(r.status_code, 302)

        c = Client()
        r = c.get(reverse(remove), self.bad_data)
        self.assertEquals(r.status_code, 302)

        c = Client()
        r = c.get(reverse(remove), self.good_data)
        self.assertEquals(r.status_code, 302)

    def test_bad_data(self):
        c = Client()
        c.login(username='admin', password='12345')

        count_before = Student.objects.count()
        c.post(reverse(remove), self.bad_data)
        self.assertEquals(count_before, Student.objects.count())

    def test_good_data(self):
        c = Client()
        c.login(username='admin', password='12345')

        count_before = Student.objects.count()
        c.post(reverse(remove), self.good_data)
        self.assertEquals(count_before, Student.objects.count() + 1)

        c.post(reverse(remove), self.good_data)
        self.assertEquals(0, Student.objects.count())


