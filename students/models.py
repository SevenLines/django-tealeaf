# coding: utf-8
# Create your models here.
import json

from django.db import models, transaction
from django.db.models.signals import post_delete, post_save
from django.db.transaction import atomic
from django.dispatch.dispatcher import receiver
from django.forms import model_to_dict
from markupfield.fields import MarkupField

from app.utils import json_dthandler
import students.utils
from students.utils import current_year


class Group(models.Model):
    title = models.CharField(max_length=10, default='')
    ancestor = models.ForeignKey('self', null=True, default=None, blank=True, on_delete=models.SET_NULL)
    year = models.IntegerField(default=students.utils.current_year())
    captain = models.ForeignKey("Student", default=None, null=True,
                                on_delete=models.SET_NULL, related_name="%(class)s_captain")

    def __unicode__(self):
        return "%s | %s" % (self.year, self.title)

    @staticmethod
    def year_groups(year):
        """
        return groups of specific year
        :param year: specific year
        :return:
        """
        return Group.objects.filter(year=year)

    @staticmethod
    def current_year_groups():
        """
        groups of current learning year
        :return:
        """
        return Group.year_groups(year=students.utils.current_year())

    @property
    def students(self):
        """
        students of this group
        use like this: some_group.students.all()
        :return:
        """
        return Group.objects.get(pk=self.pk).student_set

    @transaction.atomic
    def copy_to_next_year(self):
        g = Group.objects.get(pk=self.pk)
        g.pk = None
        g.year += 1
        g.ancestor = self
        g.save()
        for s in self.students.all():
            s.pk = None
            s.group = g
            s.save()

    @property
    def has_ancestor(self):
        return Group.objects.filter(ancestor=self.pk, year=self.year + 1).exists()

    def lessons(self, discipline):
        """
        lessons for current group for current discipline
        use like: lessons.all()
        :return:
        """
        lst = Mark.objects.filter(student__group=self.pk).values('lesson').distinct()
        return Lesson.objects.filter(pk__in=lst).distinct()


class Student(models.Model):
    name = models.CharField(max_length=50, default='')
    second_name = models.CharField(max_length=50, default='')
    group = models.ForeignKey(Group, null=True)

    def __unicode__(self):
        return "%s | %s" % (self.second_name, self.name)

    @staticmethod
    def year_students(year):
        groups = Group.year_groups(year)
        return Student.objects.filter(groups__in=groups)

    @staticmethod
    def current_year_students():
        """
        students of current learning year
        :return:
        """
        return Student.year_students(current_year())

    def marks_for_discipline(self, discipline):
        assert isinstance(discipline, Discipline)
        return Mark.objects.filter(lesson__discipline=discipline, student=self)


class Discipline(models.Model):
    """
    дисциплина
    """
    title = models.CharField(max_length=50, default='')
    year = models.IntegerField(default=students.utils.current_year())
    semestr = models.SmallIntegerField(default=students.utils.current_semestr())

    def __unicode__(self):
        return u"%s %s %s" % (self.title, self.year, self.semestr)

    def marks(self, group_id):
        marks = list(Mark.objects.raw("""
SELECT s.id as student_id, l.lesson_id, date, sm.id as id, mark
FROM students_student s
  LEFT JOIN (SELECT id as lesson_id, date
        FROM students_lesson sl
        WHERE group_id = %(group_id)s and discipline_id = %(discipline_id)s) l ON true
  LEFT JOIN students_mark sm ON l.lesson_id = sm.lesson_id and s.id = sm.student_id
WHERE s.group_id = %(group_id)s and l.lesson_id is not NULL
  ORDER BY s.id, l.date, l.lesson_id
      """, {
            'group_id': group_id,
            'discipline_id': self.id
        }))

        marks = list([{"sid": m.student_id,
                       "mid": m.id,
                       "lid": m.lesson_id,
                       "m": m.mark} for m in marks])

        # студенты группы
        stdnts = Group.objects.get(pk=group_id).students.all().order_by("second_name")
        stdnts = list([model_to_dict(s) for s in stdnts])
        for s in stdnts:
            # формируем оценки для студентов
            s_marks = list(filter(lambda m: m['sid'] == s['id'], marks))
            s_sum = sum([m['m'] for m in s_marks if m['m']], 0)
            s.update({
                'marks': s_marks,
                'sum': s_sum
            })

        lessons = list(Lesson.objects.filter(group__pk=group_id, discipline__id=self.pk)
                       .order_by("date", "id"))
        lessons = list([{"id": l.id,
                         "lt": l.lesson_type if l.lesson_type else None,
                         "dt": l.date,
                         "dn": l.description.rendered,
                         "dn_raw": l.description.raw
                        } for l in lessons])

        # виды занятий
        lesson_types = list([{'id': t[0], 'title': t[1]} for t in Lesson.LESSON_TYPES])
        # виды оценок
        mark_types = list([{'k': t[0], 'v': t[1]} for t in Mark.MARKS])

        # формируем ответ
        return json.dumps({'lessons': lessons,
                           'students': stdnts,
                           'lesson_types': lesson_types,
                           'mark_types': mark_types, }, default=json_dthandler)


class DisciplineMarksCache(models.Model):
    discipline = models.ForeignKey(Discipline, null=True, default=None)
    group = models.ForeignKey(Group, null=True, default=None)
    marks_json = models.TextField(default="")

    @staticmethod
    def get(discipline_id, group_id):
        val = DisciplineMarksCache.objects.filter(discipline_id=discipline_id, group_id=group_id).first()
        if not val or val.marks_json == u'[]':
            val = DisciplineMarksCache.update(discipline_id, group_id)
        return val.marks_json


    @staticmethod
    def update(discipline_id, group_id):
        """
        Обновляет кеш таблицы оценок для пары дисциплина группа
        :param discipline_id:
        :param group_id:
        """
        val = DisciplineMarksCache.objects.filter(discipline_id=discipline_id, group_id=group_id).first()
        if val is None:
            val = DisciplineMarksCache()
            val.discipline_id = discipline_id
            val.group_id = group_id
        d = Discipline.objects.get(pk=discipline_id)
        marks = d.marks(group_id)
        val.marks_json = json.dumps(marks)

        val.save()

        return val


class Lesson(models.Model):
    """
    пара по некоторой дисциплине
    """

    LESSON_TYPES = [
        (1, "Пара"),
        (2, "Контрольная"),
        (3, "Экзамен"),
    ]

    description = MarkupField(default="", markup_type="textile", blank=True)

    discipline = models.ForeignKey(Discipline)
    group = models.ForeignKey(Group, null=True)
    date = models.DateField(auto_now_add=True)
    lesson_type = models.IntegerField(verbose_name="type", default=1, choices=LESSON_TYPES)


    def __unicode__(self):
        return u"%s %s (%s)" % (self.discipline, self.date, self.lesson_type)


    @staticmethod
    @atomic
    def create_lesson_for_group(group, discipline):
        """
        creates lesson with empty marks fields for group
        with current date and returns lesson on success or None on failure
        """
        assert isinstance(discipline, Discipline)
        assert isinstance(group, Group)

        l = Lesson(discipline=discipline)
        l.save()
        for s in group.students.all():
            m = Mark(lesson=l, student=s)
            m.save()
        return l


class Mark(models.Model):
    """
    оценка студента за пару
    """
    MARK_NORMAL = 0

    MARKS = [
        # (MARK_NORMAL-3, 'terrible'),
        # (MARK_NORMAL-2, 'bad'),
        (MARK_NORMAL - 2, 'absent'),
        (MARK_NORMAL, 'empty'),  # без оценки
        (MARK_NORMAL + 1, 'normal'),
        (MARK_NORMAL + 2, 'good'),
        (MARK_NORMAL + 3, 'excellent'),
        (MARK_NORMAL + 4, 'awesome'),
        (MARK_NORMAL + 5, 'fantastic'),
        # (MARK_NORMAL + 6, 'godlike'),
    ]

    student = models.ForeignKey(Student)
    lesson = models.ForeignKey(Lesson)
    mark = models.SmallIntegerField(choices=MARKS, default=MARK_NORMAL)

    def __unicode__(self):
        return u"%s %s" % (self.student, self.mark)

    @staticmethod
    def get_for(group, discipline):
        return Mark.objects.filter(lesson__discipline=discipline, student__group=group).all()

    @staticmethod
    def get_for_id(group_id, discipline_id):
        return Mark.get_for(Group.objects.get(pk=group_id), Discipline.objects.get(pk=discipline_id))


def active_years(r=2):
    """
    returns list of active years like current year +-r
    :param r: range from current year [-r, r]
    :return:
    """
    years = Group.objects.all().values_list('year').distinct()
    if len(years) == 0:
        years = [current_year(), ]
    else:
        years = list(zip(*years)[0])

    _min = min(years)
    _max = max(years)
    for i in xrange(1, r + 1):
        years.insert(0, _min - i)
    for i in xrange(1, r + 1):
        years.append(_max + i)
    years.sort()
    return years


@receiver(post_delete, sender=Lesson)
@receiver(post_save, sender=Lesson)
def update_cache_lesson(instance, **kwargs):
    DisciplineMarksCache.update(instance.discipline_id, instance.group_id)


@receiver(post_delete, sender=Student)
@receiver(post_save, sender=Student)
def update_cache_student(instance, **kwargs):
    DisciplineMarksCache.objects.filter(group=instance.group_id).delete()
