# coding: utf-8
# Create your models here.

from django.db import models, transaction
from django.db.transaction import atomic

import students.utils
from students.utils import current_year


class Group(models.Model):
    title = models.CharField(max_length=10, default='')
    ancestor = models.ForeignKey('self', null=True, default=None, blank=True)
    year = models.IntegerField(default=students.utils.current_year())

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


class LessonType(models.Model):
    title = models.CharField(max_length=50)


class Lesson(models.Model):
    """
    пара по некоторой дисциплине
    """
    discipline = models.ForeignKey(Discipline)
    group = models.ForeignKey(Group)
    date = models.DateTimeField(auto_now_add=True)
    lesson_type = models.ForeignKey(LessonType, verbose_name="type", blank=True, null=True)

    def __unicode__(self):
        return u"%s %s (%s)" % (self.discipline, self.date, self.lesson_type.title)


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
    student = models.ForeignKey(Student)
    lesson = models.ForeignKey(Lesson)
    mark = models.CharField(max_length=10, default='')

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

