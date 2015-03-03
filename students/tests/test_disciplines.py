import json
from django.core.urlresolvers import reverse
from app.utils import MyTestCase
from students.models.discipline import Discipline
from students.models.group import Group
from students.models.labs import StudentLab
from students.models.lesson import Lesson
from students.models.mark import Mark
from students.models.student import Student
from students.utils import current_year


class TestDisciplinesViews(MyTestCase):
    def setUp(self):
        super(TestDisciplinesViews, self).setUp()

    def test_guest_can_see_visible_disciplines_with_marks(self):
        Discipline.objects.all().delete()

        self.discipline = Discipline.objects.create(visible=True)
        self.group = Group.objects.create(year=current_year())
        self.student = Student.objects.create(group=self.group)
        self.lesson = Lesson.objects.create(discipline=self.discipline, group=self.group)
        self.mark = Mark.objects.create(lesson=self.lesson, student=self.student)

        response = self.client.get(reverse('students.views.marks.disciplines.index'))
        self.assertEqual(response.status_code, 200)
        disciplines = json.loads(response.content)

        self.assertEqual(len(disciplines), 1)
        self.assertEqual(disciplines[0]['id'], self.discipline.id)

    def test_guest_can_see_visible_disciplines_with_labs(self):
        Discipline.objects.all().delete()

        self.disciplineOnlyWithLabs = Discipline.objects.create(visible=True)
        self.group = Group.objects.create(year=current_year())
        self.student = Student.objects.create(group=self.group)
        self.lab = StudentLab.objects.create(discipline=self.disciplineOnlyWithLabs, visible=True)
        self.lab = StudentLab.objects.create(discipline=self.disciplineOnlyWithLabs)

        response = self.client.get(reverse('students.views.marks.disciplines.index'))
        self.assertEqual(response.status_code, 200)
        disciplines = json.loads(response.content)

        self.assertEqual(len(disciplines), 1)
        self.assertEqual(disciplines[0]['id'], self.disciplineOnlyWithLabs.id)

    def test_guest_cant_see_hidden_disciplines(self):
        Discipline.objects.all().delete()

        self.discipline = Discipline.objects.create(visible=False)
        self.group = Group.objects.create(year=current_year())
        self.student = Student.objects.create(group=self.group)
        self.lesson = Lesson.objects.create(discipline=self.discipline, group=self.group)
        self.mark = Mark.objects.create(lesson=self.lesson, student=self.student)
        self.lab = StudentLab.objects.create(discipline=self.discipline, visible=True)
        self.lab = StudentLab.objects.create(discipline=self.discipline)

        response = self.client.get(reverse('students.views.marks.disciplines.index'))
        self.assertEqual(response.status_code, 200)
        disciplines = json.loads(response.content)

        self.assertEqual(len(disciplines), 0)


    def test_guest_cant_see_visible_disciplines_without_active_labs(self):
        Discipline.objects.all().delete()

        self.disciplineOnlyWithLabs = Discipline.objects.create(visible=True)
        self.group = Group.objects.create(year=current_year())
        self.student = Student.objects.create(group=self.group)
        self.lab = StudentLab.objects.create(discipline=self.disciplineOnlyWithLabs,visible=False)
        self.lab = StudentLab.objects.create(discipline=self.disciplineOnlyWithLabs,visible=False)

        response = self.client.get(reverse('students.views.marks.disciplines.index'))
        self.assertEqual(response.status_code, 200)
        disciplines = json.loads(response.content)

        self.assertEqual(len(disciplines), 0)

    def test_guest_cant_see_visible_disciplines_without_active_students(self):
        Discipline.objects.all().delete()

        self.disciplineOnlyWithLabs = Discipline.objects.create(visible=True)
        self.group = Group.objects.create(year=current_year())
        self.student = Student.objects.create(group=self.group)

        response = self.client.get(reverse('students.views.marks.disciplines.index'))
        self.assertEqual(response.status_code, 200)
        disciplines = json.loads(response.content)

        self.assertEqual(len(disciplines), 0)

    def test_guest_cant_see_active_disciplines_of_old_groups(self):
        Discipline.objects.all().delete()

        self.discipline = Discipline.objects.create(visible=True)
        self.group = Group.objects.create(year=100)
        self.student = Student.objects.create(group=self.group)
        self.lesson = Lesson.objects.create(discipline=self.discipline, group=self.group)
        self.mark = Mark.objects.create(lesson=self.lesson, student=self.student)

        response = self.client.get(reverse('students.views.marks.disciplines.index'))
        self.assertEqual(response.status_code, 200)
        disciplines = json.loads(response.content)

        self.assertEqual(len(disciplines), 0)

    @MyTestCase.login
    def test_logged_can_see_all_disciplines(self):
        Discipline.objects.all().delete()

        self.discipline = Discipline.objects.create(visible=True)
        self.group = Group.objects.create(year=100)
        self.student = Student.objects.create(group=self.group)
        self.lesson = Lesson.objects.create(discipline=self.discipline, group=self.group)
        self.mark = Mark.objects.create(lesson=self.lesson, student=self.student)

        self.disciplineOnlyWithLabs = Discipline.objects.create(visible=True)
        self.group = Group.objects.create(year=current_year())
        self.student = Student.objects.create(group=self.group)

        self.disciplineOnlyWithLabs = Discipline.objects.create(visible=True)
        self.group = Group.objects.create(year=current_year())
        self.student = Student.objects.create(group=self.group)
        self.lab = StudentLab.objects.create(discipline=self.disciplineOnlyWithLabs,visible=False)
        self.lab = StudentLab.objects.create(discipline=self.disciplineOnlyWithLabs,visible=False)

        self.discipline = Discipline.objects.create(visible=False)
        self.group = Group.objects.create(year=current_year())
        self.student = Student.objects.create(group=self.group)
        self.lesson = Lesson.objects.create(discipline=self.discipline, group=self.group)
        self.mark = Mark.objects.create(lesson=self.lesson, student=self.student)
        self.lab = StudentLab.objects.create(discipline=self.discipline, visible=True)
        self.lab = StudentLab.objects.create(discipline=self.discipline)

        self.disciplineOnlyWithLabs = Discipline.objects.create(visible=True)
        self.group = Group.objects.create(year=current_year())
        self.student = Student.objects.create(group=self.group)
        self.lab = StudentLab.objects.create(discipline=self.disciplineOnlyWithLabs, visible=True)
        self.lab = StudentLab.objects.create(discipline=self.disciplineOnlyWithLabs)

        self.discipline = Discipline.objects.create(visible=True)
        self.group = Group.objects.create(year=current_year())
        self.student = Student.objects.create(group=self.group)
        self.lesson = Lesson.objects.create(discipline=self.discipline, group=self.group)
        self.mark = Mark.objects.create(lesson=self.lesson, student=self.student)

        response = self.client.get(reverse('students.views.marks.disciplines.index'))
        self.assertEqual(response.status_code, 200)
        disciplines = json.loads(response.content)

        self.assertEqual(len(disciplines), 6)
