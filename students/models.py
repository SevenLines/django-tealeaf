# coding: utf-8
# Create your models here.
from datetime import date

from django.db import models, transaction

import students.utils


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