import json
from datetime import timedelta
from django.core.urlresolvers import reverse
from app.utils import MyTestCase
from students.models.discipline import Discipline, DisciplineMarksCache
from students.models.group import Group
from students.models.lesson import Lesson
from students.models.mark import Mark
from students.models.student import Student
from students.utils import current_year

__author__ = 'm'


class TestMarks(MyTestCase):

    def setUp(self):
        super(TestMarks, self).setUp()
        self.discipline = Discipline.objects.create(visible=True)
        self.group = Group.objects.create(year=current_year())
        self.student = Student.objects.create(group=self.group)
        self.student2 = Student.objects.create(group=self.group)
        self.lesson = Lesson.objects.create(discipline=self.discipline, group=self.group)
        self.lesson2 = Lesson.objects.create(discipline=self.discipline, group=self.group)
        self.mark = Mark.objects.create(lesson=self.lesson, student=self.student)
        self.mark2 = Mark.objects.create(lesson=self.lesson2, student=self.student2)

    def test_anyone_can_get_index(self):
        response = self.client.get(reverse('students.views.marks.index'))
        self.assertEqual(response.status_code, 200)

    def test_anyone_can_get_students(self):
        response = self.client.get(reverse('students.views.marks.students'), {
            'discipline_id': self.discipline.id,
            'group_id': self.group.id
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(len(data['students']), Student.objects.filter(group=self.group).count())

        lessons_count = Lesson.objects.filter(discipline=self.discipline,group=self.group).count()

        self.assertEqual(len(data['lessons']), lessons_count)
        self.assertEqual(len(data['students'][0]['marks']), lessons_count)
        self.assertEqual(len(data['students'][1]['marks']), lessons_count)

    def test_guest_cant_add_lesson(self):
        response = self.client.post(reverse('students.views.marks.lesson_add'), {
            'discipline_id': self.discipline.id,
            'group_id': self.group.id
        })
        self.assertEqual(response.status_code, 302)

    @MyTestCase.login
    def test_logged_can_add_lesson(self):
        count_before = Lesson.objects.filter(discipline=self.discipline,group=self.group).count()
        response = self.client.post(reverse('students.views.marks.lesson_add'), {
            'discipline_id': self.discipline.id,
            'group_id': self.group.id
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Lesson.objects.filter(discipline=self.discipline,group=self.group).count(), count_before+1)

    def test_guest_cant_reset_cache(self):
        response = self.client.post(reverse('students.views.marks.reset_cache'), {
            'discipline_id': self.discipline.id,
            'group_id': self.group.id
        })
        self.assertEqual(response.status_code, 302)

    @MyTestCase.login
    def test_resetting_cache_clears_all_its_item(self):
        DisciplineMarksCache.objects.create(discipline=self.discipline, group=self.group)
        response = self.client.post(reverse('students.views.marks.reset_cache'), {
            'discipline_id': self.discipline.id,
            'group_id': self.group.id
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(DisciplineMarksCache.objects.count(), 0)

    def test_guest_cant_remove_lesson(self):
        l = Lesson.objects.create(discipline=self.discipline, group=self.group)
        response = self.client.post(reverse('students.views.marks.lesson_remove'), {
            'lesson_id': l.id,
        })
        self.assertEqual(response.status_code, 302)

    @MyTestCase.login
    def test_logged_can_delete_lesson(self):
        l = Lesson.objects.create(discipline=self.discipline, group=self.group)
        response = self.client.post(reverse('students.views.marks.lesson_remove'), {
            'lesson_id': l.id,
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Lesson.objects.filter(id=l.id).count(), 0)

    def test_guest_cant_update_lesson(self):
        new_values = {
            'lesson_id': self.lesson.id,
            'data': self.lesson.date,
            'description_raw': self.lesson.description.raw,
            'discipline': self.lesson.discipline.id,
            'lesson_type': self.lesson.lesson_type,
            'score_ignore': self.lesson.score_ignore,
            'multiplier': self.lesson.multiplier,
        }

        response = self.client.post(reverse('students.views.marks.lesson_save'), new_values)
        self.assertEqual(response.status_code, 302)

    @MyTestCase.login
    def test_lesson_save_should_update_values(self):
        d = Discipline.objects.create()
        new_values = {
            'lesson_id': self.lesson.id,
            'date': self.lesson.date + timedelta(days=1),
            'description_raw': self.lesson.description.raw + "22",
            'discipline': d.id,
            'lesson_type': self.lesson.lesson_type + 1,
            'score_ignore': 'false' if not self.lesson.score_ignore else 'true',
            'multiplier': self.lesson.multiplier + 1,
        }

        response = self.client.post(reverse('students.views.marks.lesson_save'), new_values)
        self.assertEqual(response.status_code, 200)

        self.lesson = Lesson.objects.get(id=self.lesson.id)
        for key in new_values:
            if key == 'discipline':
                self.assertEqual(self.lesson.discipline.id, new_values['discipline'])
            elif key == 'description_raw':
                self.assertEqual(self.lesson.description.raw, new_values['description_raw'])
            elif key == 'lesson_id':
                pass
            elif key == 'score_ignore':
                self.assertEqual('true' if self.lesson.score_ignore else 'false', new_values['score_ignore'])
            else:
                self.assertEqual(getattr(self.lesson, key), new_values[key])


    def test_guest_cant_save_marks(self):
        response = self.client.post(reverse('students.views.marks.marks_save'), {
            'marks': '[]'
        })
        self.assertEqual(response.status_code, 302)

    @MyTestCase.login
    def test_marks_save_should_update_marks_value(self):
        self.mark.mark = 10
        self.mark.save()

        response = self.client.post(reverse('students.views.marks.marks_save'), {
            'marks': json.dumps([{
                'lesson_id': self.lesson.id,
                'student_id': self.student.id,
                'mark': 2
            }])
        })
        self.assertEqual(response.status_code, 200)

        mark = Mark.objects.get(id=self.mark.id)
        self.assertEqual(mark.mark, 2)

    @MyTestCase.login
    def test_marks_save_can_add_new_marks(self):
        lesson = Lesson.objects.create(discipline=self.discipline, group=self.group)
        count_before = Mark.objects.filter(lesson=lesson, student=self.student).count()
        response = self.client.post(reverse('students.views.marks.marks_save'), {
            'marks': json.dumps([{
                'lesson_id': lesson.id,
                'student_id': self.student.id,
                'mark': 2
            }])
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Mark.objects.filter(lesson=lesson, student=self.student).count(), count_before+1)

    @MyTestCase.login
    def test_marks_can_delete_mark(self):
        lesson = Lesson.objects.create(discipline=self.discipline, group=self.group)
        mark = Mark.objects.create(lesson=lesson, student=self.student)

        response = self.client.post(reverse('students.views.marks.marks_save'), {
            'marks': json.dumps([{
                'lesson_id': lesson.id,
                'student_id': self.student.id,
                'mark': Mark.MARK_BASE
            }])
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Mark.objects.filter(lesson=lesson, student=self.student).count(), 0)

    def test_anyone_can_get_marks_to_excel(self):
        response = self.client.get(reverse('students.views.marks.marks_to_excel'), {
            'discipline_id': self.discipline.id,
            'group_id': self.group.id
        })
        self.assertEqual(response.status_code, 200)

    def test_guest_cant_get_students_control(self):
        response = self.client.get(reverse('students.views.marks.students_control'), {
           'year': current_year(),
           'discipline_id': self.discipline.id,
           'k': 0.5
        })
        self.assertEqual(response.status_code, 302)

    @MyTestCase.login
    def test_students_control_returns_excel(self):
        response = self.client.get(reverse('students.views.marks.students_control'), {
           'year': current_year(),
           'discipline_id': self.discipline.id,
           'k': 0.5
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['content-type'], 'application/xlsx')

