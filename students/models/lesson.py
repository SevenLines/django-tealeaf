# coding=utf-8
from django.db import models
from django.db.models.signals import post_delete
from django.db.models.signals import post_save
from django.db.transaction import atomic
from django.dispatch import receiver
from django.forms import model_to_dict
from filer.fields.image import FilerImageField
from markupfield.fields import MarkupField

from students.models.mark import Mark
from students.models.discipline import Discipline


class Lesson(models.Model):
    """
    пара по некоторой дисциплине
    """

    LESSON_TYPE_PRACTICE = 1
    LESSON_TYPE_TEST = 2
    LESSON_TYPE_LECTION = 3
    LESSON_TYPE_LAB = 4
    LESSON_TYPE_EXAM = 5

    LESSON_TYPES = [
        (LESSON_TYPE_PRACTICE, "Практика"),
        (LESSON_TYPE_TEST, "Контрольная"),
        (LESSON_TYPE_LECTION, "Лекция"),
        (LESSON_TYPE_LAB, "Лабораторная"),
        (LESSON_TYPE_EXAM, "Экзамен"),
    ]

    description = MarkupField(default="", markup_type="textile", blank=True)

    discipline = models.ForeignKey("Discipline")
    group = models.ForeignKey("Group", null=True)
    date = models.DateField(auto_now_add=True)
    lesson_type = models.IntegerField(verbose_name="type", default=1, choices=LESSON_TYPES)
    icon = FilerImageField(null=True, blank=True, default=None)
    multiplier = models.FloatField(default=1)

    score_ignore = models.BooleanField(default=False)

    def to_dict(self):
        d = model_to_dict(self)
        d.update({
            'description': self.description.rendered,
            'description_raw': self.description.raw,
            'icon_id': self.icon.id if self.icon else None,
            'icon_url': self.icon.url if self.icon else None,
            'icon': None,
        })
        return d

    def __unicode__(self):
        return u"%s %s (%s)" % (self.discipline, self.date, self.lesson_type)


    @staticmethod
    @atomic
    def create_lesson_for_group(group, discipline):
        """
        creates lesson with empty marks fields for group
        with current date and returns lesson on success or None on failure
        """
        from students.models.group import Group
        from students.models.discipline import Discipline

        assert isinstance(discipline, Discipline)
        assert isinstance(group, Group)

        l = Lesson(discipline=discipline)
        l.save()
        for s in group.students.all():
            m = Mark(lesson=l, student=s)
            m.save()
        return l


@receiver(post_delete, sender=Lesson)
@receiver(post_save, sender=Lesson)
def update_cache_lesson(instance, **kwargs):
    from students.models.discipline import DisciplineMarksCache

    DisciplineMarksCache.update(instance.discipline_id, instance.group_id)
