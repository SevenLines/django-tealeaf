# coding=utf-8
import json
from django.core.urlresolvers import reverse
from app.utils import MyTestCase
from students.models import Mark
from students.models.discipline import Discipline
from students.models.group import Group
from students.models.lesson import Lesson
from students.models.student import Student
from students.utils import current_year


class TestStudentsManager(MyTestCase):
    def setUp(self):
        super(TestStudentsManager, self).setUp()
        self.discipline = Discipline.objects.create(visible=True)
        self.disciplineHidden = Discipline.objects.create()

        self.group1 = Group.objects.create(year=current_year())

        self.groupActive = Group.objects.create(year=current_year(), title="IamActiveGroup")
        self.lesson = Lesson.objects.create(group=self.groupActive, discipline=self.discipline)
        self.student = Student.objects.create(group=self.groupActive)
        Mark.objects.create(lesson=self.lesson, student=self.student)


    def test_guest_cant_access_students_manager(self):
        response = self.client.get(reverse('students.views.students.index'))
        self.assertEqual(response.status_code, 302)

    def test_anyone_can_get_xlsx_report(self):
        response = self.client.get(reverse('students.views.students.ajax.xlsx'), {
            'year': current_year()
        })
        self.assertEqual(response.status_code, 200)

    def test_guest_can_get_only_the_current_year(self):
        response = self.client.get(reverse('students.views.students.ajax.json.years'))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['year'], current_year())

    @MyTestCase.login
    def test_logged_used_can_get_more_then_one_year(self):
        response = self.client.get(reverse('students.views.students.ajax.json.years'))

        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertGreater(len(data), 1)

    def test_guest_can_see_only_active_groups(self):
        response = self.client.get(reverse('students.views.students.ajax.json.groups'), {
            'discipline_id': self.discipline.id
        })

        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content)
        self.assertEqual(len(data), 1)
        self.assertEqual(int(data[0]['id']), self.groupActive.id)


    @MyTestCase.login
    def test_logged_can_see_all_groups(self):
        response = self.client.get(reverse('students.views.students.ajax.json.groups'), {
            'year': current_year()
        })
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content)
        self.assertEqual(len(data), Group.objects.filter(year=current_year()).count())

    def test_guest_cant_update_students(self):
        response = self.client.post(reverse('students.views.students.ajax.json.save_students'), {
            'students': json.dumps('[]')
        })
        self.assertEqual(response.status_code, 302)

    @MyTestCase.login
    def test_update_students_change_student_values(self):
        new_data = {
            'id': self.student.id,
            'name': self.student.name + "22",
            'second_name': self.student.second_name + "22",
            'sex': not self.student.sex,
            'email': self.student.email + "22",
            'vk': self.student.vk + "22",
            'group_id': self.group1.id,
        }

        response = self.client.post(reverse('students.views.students.ajax.json.save_students'), {
            'students': json.dumps([new_data])
        })
        self.assertEqual(response.status_code, 200)

        self.student = Student.objects.get(id=self.student.id)

        for key in new_data.keys():
            if key == 'group':
                self.assertEqual(new_data['group_id'], self.student.group_id)
            else:
                self.assertEqual(getattr(self.student, key), new_data[key])

    @MyTestCase.login
    def test_update_students_delete_students(self):
        student_to_delete = Student.objects.create(group=self.groupActive)
        response = self.client.post(reverse('students.views.students.ajax.json.save_students'), {
            'students': json.dumps([{
                'id': student_to_delete.id,
                '_destroy': 'true'
            }])
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Student.objects.filter(id=student_to_delete.id).count(), 0)

    @MyTestCase.login
    def test_update_students_can_add_new_student(self):
        count_before = Student.objects.count()

        response = self.client.post(reverse('students.views.students.ajax.json.save_students'), {
            'students': json.dumps([{
                'id': -1,
                'name': 'test_update_students',
                'group': self.groupActive.id
            }])
        })

        self.assertEqual(Student.objects.count(), count_before + 1)
        self.assertEqual(Student.objects.filter(name__contains='test_update_students').count(), 1)

    def test_guest_cant_save_groups(self):
        response = self.client.post(reverse('students.views.students.ajax.json.save_groups'), {
            'groups': json.dumps([])
        })

        self.assertEqual(response.status_code, 302)

    @MyTestCase.login
    def test_save_groups_should_update_values(self):
        new_values = {
            'id': self.groupActive.id,
            'title': self.groupActive.title + "22",
            'year': self.groupActive.year + 1,
            'ancestor': self.group1.id,
            'captain': self.student.id
        }

        response = self.client.post(reverse('students.views.students.ajax.json.save_groups'), {
            'groups': json.dumps([new_values])
        })

        self.assertEqual(response.status_code, 200)

        self.groupActive = Group.objects.get(id=self.groupActive.id)

        for key in new_values.keys():
            if key == 'ancestor':
                self.assertEqual(new_values['ancestor'], self.groupActive.ancestor_id)
            elif key == 'captain':
                self.assertEqual(new_values['captain'], self.groupActive.captain_id)
            else:
                self.assertEqual(getattr(self.groupActive, key), new_values[key])

    @MyTestCase.login
    def test_save_groups_can_delete_group(self):
        group_to_delete = Group.objects.create()

        response = self.client.post(reverse('students.views.students.ajax.json.save_groups'), {
            'groups': json.dumps([{
                'id': group_to_delete.id,
                '_destroy': 'true'
            }])
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Group.objects.filter(id=group_to_delete.id).count(), 0)

    @MyTestCase.login
    def test_save_groups_can_add_new_group(self):
        count_before = Group.objects.count()
        response = self.client.post(reverse('students.views.students.ajax.json.save_groups'), {
            'groups': json.dumps([{
                'id': -1,
                'title': '####'
            }])
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Group.objects.filter(title__contains='####').count(), 1)

    def test_guest_cant_copy_group_to_next_year(self):
        response = self.client.post(reverse('students.views.students.ajax.json.copy_to_next_year'), {
            'group_id': self.groupActive.id
        })
        self.assertEqual(response.status_code, 302)

    @MyTestCase.login
    def test_copy_group_to_next_years_creates_new_group_with_same_students_count(self):
        self.groupActive.title = "IamAboutToCopied"
        self.groupActive.save()

        student = Student.objects.create(group=self.groupActive, name='IamCopied')
        self.assertEqual(Student.objects.filter(name=student.name).count(), 1)

        self.assertEqual(Group.objects.filter(title=self.groupActive.title).count(), 1)

        response = self.client.post(reverse('students.views.students.ajax.json.copy_to_next_year'), {
            'group_id': self.groupActive.id
        })
        self.assertEqual(response.status_code, 200)

        self.assertEqual(Group.objects.filter(title=self.groupActive.title).count(), 2)
        self.assertEqual(Student.objects.filter(name=student.name).count(), 2)




