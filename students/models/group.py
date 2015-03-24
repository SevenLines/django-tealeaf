# coding=utf-8
from django.db import models
from django.db.models.query_utils import Q
from django.db.transaction import atomic
from ..models.lesson import Lesson
from ..models.mark import Mark
from ..models.student import Student
from ..models.labs import StudentTaskResult
from ..utils import *


class Group(models.Model):
    title = models.CharField(max_length=10, default='')
    ancestor = models.ForeignKey('self', null=True, default=None, blank=True, on_delete=models.SET_NULL)
    year = models.IntegerField(default=current_year())
    captain = models.ForeignKey("Student", default=None, null=True,
                                on_delete=models.SET_NULL, related_name="%(class)s_captain")

    # kindness = models.FloatField(default=1)  # показатель доброжелательности группы от 0 до 1
    # erudition = models.FloatField(default=1)  # показатель эрудированность группы от 0 до 1

    def __unicode__(self):
        return "%s | %s" % (self.year, self.title)


    @staticmethod
    def list(request, discipline_id):
        """
        list all groups, and filter active groups for guests
        :param request:
        :param discipline_id:
        :return:
        :rtype: django.db.models.query.QuerySet
        """
        if not request.user.is_authenticated():
            return Group.objects.filter(
                Q(id__in=Lesson.objects.filter(discipline=discipline_id).values('group').distinct()) |
                Q(id__in=StudentTaskResult.objects.filter(task__lab__discipline=discipline_id).values(
                    'student__group').distinct())
            )
        else:
            return Group.objects.all()

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
        return Group.year_groups(year=current_year())

    @property
    def students(self):
        """
        students of this group
        use like this: some_group.students.all()
        :return:
        """
        return Group.objects.get(pk=self.pk).student_set

    @atomic
    def copy_to_next_year(self):
        g = Group.objects.get(pk=self.pk)
        g.pk = None
        g.year += 1
        g.title = self.title
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

