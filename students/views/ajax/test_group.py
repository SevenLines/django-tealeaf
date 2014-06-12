from unittest import TestCase

from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.test.client import Client

from students.models import Group
from students.views.ajax.group import add, update, index, remove


__author__ = 'mick'


class GroupTest(TestCase):
    password = '12345'

    def setUp(self):
        self.group = Group(title='2211', year='2013')
        self.admin = User.objects.create_superuser('admin', 'mmailm@mail.ru', self.password)
        self.group.save()

        self.good_data = {
            'group_id': self.group.pk,
        }

        self.bad_data = {
            'group_id': -1,
        }

    def tearDown(self):
        self.group.delete()
        self.admin.delete()

    def login(self, c):
        c.login(username=self.admin.username, password=self.password)


class TestAdd(GroupTest):
    def test_logged(self):
        c = Client()

        r = c.post(reverse(add))
        self.assertEquals(r.status_code, 302)

        r = c.get(reverse(add))
        self.assertEquals(r.status_code, 302)

        r = c.post(reverse(add), self.good_data)
        self.assertEquals(r.status_code, 302)

        r = c.post(reverse(add), self.bad_data)
        self.assertEquals(r.status_code, 302)

        r = c.get(reverse(add), self.good_data)
        self.assertEquals(r.status_code, 302)

        r = c.get(reverse(add), self.bad_data)
        self.assertEquals(r.status_code, 302)

    def test_bad_data(self):
        c = Client()

        self.login(c)

        count_before = Group.objects.count()
        c.post(reverse(add), {
            'year': 2013,
        })
        self.assertEquals(count_before, Group.objects.count())

        count_before = Group.objects.count()
        c.post(reverse(add), {
            'title': 2011,
        })
        self.assertEquals(count_before, Group.objects.count())

    def test_good_data(self):
        c = Client()

        self.login(c)
        data = {
            'title': 2222,
            'year': 2013,
        }
        count_before = Group.objects.count()
        self.assertFalse(Group.objects.filter(title=data['title'], year=data['year']).exists())
        c.post(reverse(add), data)
        self.assertTrue(Group.objects.filter(title=data['title'], year=data['year']).exists())
        self.assertEquals(count_before + 1, Group.objects.count())


class TestUpdate(GroupTest):
    def test_logged(self):
        c = Client()

        r = c.post(reverse(add))
        self.assertEquals(r.status_code, 302)

        r = c.get(reverse(add))
        self.assertEquals(r.status_code, 302)

        r = c.post(reverse(add), self.good_data)
        self.assertEquals(r.status_code, 302)

        r = c.post(reverse(add), self.bad_data)
        self.assertEquals(r.status_code, 302)

        r = c.get(reverse(add), self.good_data)
        self.assertEquals(r.status_code, 302)

        r = c.get(reverse(add), self.bad_data)
        self.assertEquals(r.status_code, 302)

    def test_bad_data(self):
        c = Client()
        self.login(c)

        bad_data1 = {
            'group_id': -1,
            'title': '2241',
            'year': 2013,
        }

        data_before = Group.objects.all()
        c.post(reverse(update), bad_data1)
        data_after = Group.objects.all()

        self.assertTrue(all(i[0].title == i[1].title and i[0].year == i[1].year for i in zip(data_after, data_before)))

    def test_good_data(self):
        g = Group(title="2211", year=2014)
        g.save()

        c = Client()
        self.login(c)

        good_data = {
            'group_id': g.id,
            'title': '2241',
            'year': 2013,
        }

        c.post(reverse(update), good_data)
        g = Group.objects.get(pk=g.id)
        self.assertTrue(g.title == good_data['title'] and g.year == good_data['year'])

        good_data = {
            'group_id': g.id,
            'title': '2242',
        }

        c.post(reverse(update), good_data)
        g = Group.objects.get(pk=g.id)
        self.assertTrue(g.title == good_data['title'])

        good_data = {
            'group_id': g.id,
            'year': 2014,
        }

        c.post(reverse(update), good_data)
        g = Group.objects.get(pk=g.id)
        self.assertTrue(g.year == good_data['year'])

        g.delete()


class TestIndex(GroupTest):
    def test_bad_data(self):
        bad_data = {
        }
        c = Client()
        self.assertEquals(c.post(reverse(index), bad_data).status_code, 404)

    def test_good_data(self):
        good_data = {
            'year': self.group.year,
        }

        c = Client()
        r = c.post(reverse(index), good_data)

        self.assertEquals(r.status_code, 200)
        origin_data = list(Group.objects.all())
        cookie_year = c.cookies['year']
        self.assertTrue(
            all(i[0].title == i[1].title and i[0].year == i[1].year for i in zip(origin_data, r.context['groups'])))
        self.assertEquals(cookie_year.value, str(good_data['year']))


class TestRemove(GroupTest):
    def test_logged(self):
        c = Client()

        r = c.post(reverse(add))
        self.assertEquals(r.status_code, 302)

        r = c.get(reverse(add))
        self.assertEquals(r.status_code, 302)

        r = c.post(reverse(add), self.good_data)
        self.assertEquals(r.status_code, 302)

        r = c.post(reverse(add), self.bad_data)
        self.assertEquals(r.status_code, 302)

        r = c.get(reverse(add), self.good_data)
        self.assertEquals(r.status_code, 302)

        r = c.get(reverse(add), self.bad_data)
        self.assertEquals(r.status_code, 302)

    def test_bad_data(self):
        bad_data = {
            'group_id_delete': -1,
        }

        c = Client()
        self.login(c)

        g = Group(title='1234', year='2013')
        g.save()

        count_before = Group.objects.count()
        c.post(reverse(remove), bad_data)
        self.assertEqual(count_before, Group.objects.count())

        g.delete()

    def test_good_data(self):
        g = Group(title='1234', year='2013')
        g.save()

        good_data = {
            'group_id_delete': g.pk,
        }

        c = Client()
        self.assertTrue(Group.objects.filter(pk=g.pk).exists())
        c.post(reverse(remove), good_data)
        self.assertFalse(Group.objects.filter(pk=g.pk).exists())

