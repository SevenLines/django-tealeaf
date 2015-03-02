# coding=utf-8
import json
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.test import TestCase
from app.utils import MyTestCase
from students.models.discipline import Discipline
from students.models.labs import StudentLab, StudentTask, StudentTaskResult
from students.models.student import Student



class LabsViewTestCase(MyTestCase):

    def setUp(self):
        super(LabsViewTestCase, self).setUp()
        self.discipline = Discipline.objects.create(title='1111', year=2013)
        self.lab = StudentLab.objects.create(discipline=self.discipline, title='Лаба')
        self.labVisible = StudentLab.objects.create(discipline=self.discipline, title='Лаба', visible=True)
        self.task = StudentTask.objects.create(lab=self.lab)
        self.task = StudentTask.objects.create(lab=self.labVisible)

    def test_guest_cant_access_new(self):
        response = self.client.post(reverse('students.views.labsview.new'), {
            'discipline_id': self.discipline.id
        })
        self.assertEqual(response.status_code, 302)

    def test_guest_cant_access_delete(self):
        response = self.client.post(reverse('students.views.labsview.delete'), {
            'id': self.lab.id
        })
        self.assertEqual(response.status_code, 302)

    def test_guest_cant_access_save(self):
        response = self.client.post(reverse('students.views.labsview.save'), {
            'id': self.lab.id
        })
        self.assertEqual(response.status_code, 302)

    def test_guest_cant_access_save_task_marks(self):
        response = self.client.post(reverse('students.views.labsview.save_task_marks'), {
            'marks': '[]'
        })
        self.assertEqual(response.status_code, 302)

    def test_guest_cant_access_lab_save_order(self):
        response = self.client.post(reverse('students.views.labsview.lab_save_order'), {
            'order_array': '[]',
            'id': self.discipline.id
        })
        self.assertEqual(response.status_code, 302)

    def test_index_without_discipline_set_should_response_400(self):
        response = self.client.get(reverse('students.views.labsview.index'))
        self.assertEqual(response.status_code, 400)

    def test_index_for_wrong_discipline_should_response(self):
        response = self.client.get(reverse('students.views.labsview.index'), {
            'discipline_id': 0
        })
        self.assertEqual(response.status_code, 200)

    def test_index_should_response_data(self):
        response = self.client.get(reverse('students.views.labsview.index'), {
            'discipline_id': self.discipline.id
        })
        data = json.loads(response.content)
        self.assertIn('labs', data)
        self.assertIn('complex_choices', data)
        self.assertEqual(len(data['labs']), 1)
        self.assertEqual(response.status_code, 200)

    @MyTestCase.login
    def test_index_for_logged_user_should_response_unvisible_data(self):
        response = self.client.get(reverse('students.views.labsview.index'), {
            'discipline_id': self.discipline.id
        })
        data = json.loads(response.content)
        self.assertIn('labs', data)
        self.assertIn('complex_choices', data)
        self.assertEqual(len(data['labs']), 2)
        self.assertEqual(response.status_code, 200)

    @MyTestCase.login
    def test_new_should_add_new_lab(self):
        count_before = StudentLab.objects.filter(discipline=self.discipline).count()

        response = self.client.post(reverse('students.views.labsview.new'), {
            'discipline_id': self.discipline.id
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(StudentLab.objects.filter(discipline=self.discipline).count(), count_before + 1)

    @MyTestCase.login
    def test_delete_should_delete_lab(self):
        l = StudentLab.objects.create(discipline=self.discipline)
        count_before = StudentLab.objects.filter(discipline=self.discipline).count()

        response = self.client.post(reverse('students.views.labsview.delete'), {
            'id': l.id
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(StudentLab.objects.filter(discipline=self.discipline).count(), count_before - 1)

    @MyTestCase.login
    def test_save_should_update_lab(self):
        new_title = u"22"
        new_cols_count = self.lab.columns_count * 2 + 1
        new_regular = not self.lab.regular
        new_description = u"22"

        response = self.client.post(reverse('students.views.labsview.save'), {
            'id': self.lab.id,
            'title': new_title,
            'columns_count': new_cols_count,
            'regular': new_regular,
            'description': new_description
        })

        self.assertEqual(response.status_code, 200)

        self.lab = StudentLab.objects.get(id=self.lab.id)
        self.assertEqual(new_title, self.lab.title)
        self.assertEqual(new_description, self.lab.description)
        self.assertEqual(new_cols_count, self.lab.columns_count)
        self.assertEqual(new_regular, self.lab.regular)

    @MyTestCase.login
    def test_save_task_marks_should_process_marks(self):
        s = Student.objects.create()

        count_before = StudentTaskResult.objects.count()

        response = self.client.post(reverse('students.views.labsview.save_task_marks'), {
            'marks': json.dumps([{
                                     'student': s.id,
                                     'task': self.task.id,
                                     'done': 'true'
                                 }])
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(StudentTaskResult.objects.count()-1, count_before)

        count_before = StudentTaskResult.objects.count()
        response = self.client.post(reverse('students.views.labsview.save_task_marks'), {
            'marks': json.dumps([{
                                     'student': s.id,
                                     'task': self.task.id,
                                     'done': 'false'
                                 }])
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(StudentTaskResult.objects.count()+1, count_before)



    @MyTestCase.login
    def test_lab_save_order_should_update_order(self):
        response = self.client.post(reverse('students.views.labsview.lab_save_order'), {
            'id': self.discipline.id,
            'order_array': json.dumps([self.lab.id, self.labVisible.id])
        })

        self.assertEqual(response.status_code, 200)

        self.lab = StudentLab.objects.get(id=self.lab.id)
        self.labVisible = StudentLab.objects.get(id=self.labVisible.id)

        self.assertEqual(self.labVisible._order - self.lab._order, 1)

        response = self.client.post(reverse('students.views.labsview.lab_save_order'), {
            'id': self.discipline.id,
            'order_array': json.dumps([self.labVisible.id, self.lab.id])
        })

        self.assertEqual(response.status_code, 200)

        self.lab = StudentLab.objects.get(id=self.lab.id)
        self.labVisible = StudentLab.objects.get(id=self.labVisible.id)

        self.assertEqual(self.labVisible._order - self.lab._order, -1)




