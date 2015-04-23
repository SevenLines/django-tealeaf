from app.utils import MyTestCase
from students.models import Student, Group
from students.models.discipline import Discipline
from students.models.labs import StudentTaskResult, StudentTask, StudentLab

__author__ = 'm'


class TestStudentTaskResult(MyTestCase):

    def test_as_dict_should_return_correct_data(self):
        group = Group.objects.create()
        student = Student.objects.create(group=group)
        discipline = Discipline.objects.create()
        lab = StudentLab.objects.create(discipline=discipline)
        task = StudentTask.objects.create(lab=lab)

        s = StudentTaskResult.objects.create(student=student, task=task)
        date = s.date_update
        dct = s.as_dict
        self.assertIn('student', dct)
        self.assertIn('task', dct)
        self.assertIn('created', dct)
        self.assertIn('done', dct)
        self.assertIn('group', dct)

        self.assertEqual(dct['created'], date.isoformat())
        self.assertEqual(dct['student'], student.pk)
        self.assertEqual(dct['task'], task.pk)