# coding: utf-8
# Create your models here.
from datetime import date

from django.db import models, transaction
from django.db.models.fields.related import ForeignKey

import students.utils
from students.utils import current_year


class Group(models.Model):
    title = models.CharField(max_length=10, default='')
    year = models.IntegerField(default=students.utils.current_year())

    def __unicode__(self):
        return "%s | %s" % (self.year, self.title)

    @staticmethod
    def current_year_groups():
        """
        groups of current learning year
        :return:
        """
        return Group.objects.filter(year=students.utils.current_year())

    @property
    def students(self):
        """
        students of this group
        use like this: some_group.students.all()
        :return:
        """
        return Group.objects.get(pk=self.pk).student_set

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
    def current_year_students():
        """
        students of current learning year
        :return:
        """
        groups = Group.current_year_groups()
        return Student.objects.filter(group__in=groups)

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


class Lesson(models.Model):
    """
    пара по некоторой дисциплине
    """
    discipline = models.ForeignKey(Discipline)
    date = models.DateField(default=date.today())

    def __unicode__(self):
        return u"%s %s.%s" % (self.discipline, self.date.day, self.date.month)


    @staticmethod
    def create_lesson_for_group(group, discipline):
        """
        creates lesson with empty marks fields for group
        with current date and returns lesson on success or None on failure
        """
        assert isinstance(discipline, Discipline)
        assert isinstance(group, Group)

        with transaction.atomic():
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
    student = models.ForeignKey(Student)
    lesson = models.ForeignKey(Lesson)
    mark = models.CharField(max_length=10, default='')

    def __unicode__(self):
        return u"%s %s" % (self.student, self.mark)


class Lab(models.Model):
    title = models.CharField(max_length=200, blank=True, default="")
    description = models.TextField(blank=True, default="")
    discipline = ForeignKey(Discipline)

    def __unicode__(self):
        return self.title


class Task(models.Model):
    UNDEFINED = ""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    NIGHTMARE = "nightmare"

    COMPLEX_CHOICES = (
        (UNDEFINED, ""),
        (EASY, "Easy"),
        (MEDIUM, "Medium"),
        (HARD, "Hard"),
        (NIGHTMARE, "Nightmare"),
    )

    lab = ForeignKey(Lab)
    description = models.TextField(blank=True, default="")
    complexity = models.CharField(max_length=20,
                                  choices=COMPLEX_CHOICES,
                                  default=EASY)

    def __unicode__(self):
        return self.description[:50]


def active_years(r=2):
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
