# coding=utf-8
from django.db import models


class MarkBaseModel(models.Model):
    """
    оценка студента за пару
    """
    class Meta:
        abstract = True

    MARK_BASE = 0
    MARK_SPECIAL = 1000

    MARK_BLACK_HOLE = MARK_BASE - (MARK_SPECIAL + 1)
    MARK_ABSENT = MARK_BASE - 2
    MARK_EMPTY = MARK_BASE
    MARK_NORMAL = MARK_BASE + 1
    MARK_GOOD = MARK_BASE + 2
    MARK_EXCELLENT = MARK_BASE + 3
    MARK_AWESOME = MARK_BASE + 4
    MARK_FANTASTIC = MARK_BASE + 5
    MARK_INCREDIBLE = MARK_BASE + 6
    MARK_SHINING = MARK_BASE + (MARK_SPECIAL + 1)
    MARK_MERCY = MARK_BASE + (MARK_SPECIAL + 2)
    MARK_KEEP = MARK_BASE + (MARK_SPECIAL + 3)

    MARKS = [
        # (MARK_NORMAL-3, 'terrible'),
        # (MARK_NORMAL-2, 'bad'),
        (MARK_BLACK_HOLE, 'black-hole'),
        (MARK_ABSENT, 'absent'),
        (MARK_EMPTY, 'empty'),  # без оценки
        (MARK_NORMAL, 'normal'),
        (MARK_GOOD, 'good'),
        (MARK_EXCELLENT, 'excellent'),
        (MARK_AWESOME, 'awesome'),
        (MARK_FANTASTIC, 'fantastic'),
        (MARK_INCREDIBLE, 'incredible'),
        (MARK_SHINING, 'shining'),
        (MARK_MERCY, 'mercy'),
        (MARK_MERCY, 'mercy'),
        # (MARK_KEEP, 'keep'),
        # (MARK_NORMAL + 6, 'godlike'),
    ]

    date_create = models.DateTimeField(auto_now_add=True)
    date_update = models.DateTimeField(auto_now=True)
    mark = models.SmallIntegerField(choices=MARKS, default=MARK_NORMAL)


class Mark(MarkBaseModel):
    student = models.ForeignKey("Student")
    lesson = models.ForeignKey("Lesson")

    def __unicode__(self):
        return u"%s %s" % (self.student, self.mark)

    @staticmethod
    def get_for(group, discipline):
        return Mark.objects.filter(lesson__discipline=discipline, student__group=group).all()

    @staticmethod
    def get_for_id(group_id, discipline_id):
        from students.models.group import Group
        from students.models.discipline import Discipline

        return Mark.get_for(Group.objects.get(pk=group_id), Discipline.objects.get(pk=discipline_id))
