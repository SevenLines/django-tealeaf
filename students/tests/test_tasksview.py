from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.test import TestCase
from students.models.discipline import Discipline
from students.models.labs import StudentTask, StudentLab

__author__ = 'm'


def login(fn):
    def _wrapper(self=None):
        self.client.login(username=self.root.username, password=self.password)
        fn(self)
        self.client.logout()

    return _wrapper


class LabsViewTestCase(TestCase):
    password = '12345'

    def setUp(self):
        self.root = User.objects.create_superuser('root', 'mailm@mail.ru', self.password)
        self.discipline = Discipline.objects.create()
        self.lab = StudentLab.objects.create(discipline=self.discipline)
        self.task = StudentTask.objects.create(lab=self.lab)

    def test_guest_cant_save(self):
        response = self.client.post(reverse('students.views.tasksview.save'), {
            'id': self.task.id,
        })

        self.assertEqual(response.status_code, 302)

    def test_guest_cant_delete(self):
        response = self.client.post(reverse('students.views.tasksview.delete'), {
            'id': self.task.id,
        })

        self.assertEqual(response.status_code, 302)

    def test_guest_cant_add_new(self):
        response = self.client.post(reverse('students.views.tasksview.new'), {
            'id': self.task.id,
        })

        self.assertEqual(response.status_code, 302)

    @login
    def test_save_should_update_values(self):
        new_description = self.task.description + u"22"
        new_complexity = self.task.complexity + 1

        response = self.client.post(reverse('students.views.tasksview.save'), {
            'id': self.task.id,
            'description': new_description,
            'complexity': new_complexity
        })

        self.task = StudentTask.objects.get(id=self.task.id)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.task.description, new_description)
        self.assertEqual(self.task.complexity, new_complexity)

    @login
    def test_delete_should_remove_task(self):
        task = StudentTask.objects.create(lab=self.lab)

        response = self.client.post(reverse('students.views.tasksview.delete'), {
            'id': self.task.id,
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(StudentLab.objects.filter(id=task.id).count(), 0)

    @login
    def test_new_should_add_new_task(self):
        count_before = StudentTask.objects.filter(lab=self.lab).count()
        response = self.client.post(reverse('students.views.tasksview.new'), {
            'lab_id': self.lab.id,
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(count_before+1, StudentTask.objects.filter(lab=self.lab).count())