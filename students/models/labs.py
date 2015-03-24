# coding=utf-8
from django.db import models
from django.forms.models import model_to_dict
from ..models.student import Student
from ..models.mark import MarkBaseModel


class StudentLab(models.Model):
    title = models.CharField(max_length=100, default='')
    description = models.TextField(default='')
    discipline = models.ForeignKey('Discipline')
    visible = models.BooleanField(default=False)
    columns_count = models.SmallIntegerField(default=1)

    # лаба содержит список обязательный заданий для всех студентов
    regular = models.BooleanField(default=False)

    class Meta:
        order_with_respect_to = 'discipline'
        ordering = ['_order']


class StudentTask(models.Model):

    students = models.ManyToManyField("Student")

    UNDEFINED = 0
    EASY = UNDEFINED + 1
    MEDIUM = UNDEFINED + 2
    HARD = UNDEFINED + 3
    NIGHTMARE = UNDEFINED + 4

    COMPLEX_CHOICES = (
        (UNDEFINED, ""),
        (EASY, "easy"),
        (MEDIUM, "medium"),
        (HARD, "hard"),
        (NIGHTMARE, "nightmare"),
    )

    lab = models.ForeignKey('StudentLab')
    complexity = models.IntegerField(max_length=20,
                                     choices=COMPLEX_CHOICES,
                                     default=EASY)

    description = models.TextField(default="")
    order = models.SmallIntegerField(default=0)

    @property
    def as_dict(self):
        out = model_to_dict(self, exclude='students')
        out['students'] = []
        for s in self.students.all():
            assert isinstance(s, Student)
            out['students'].append({
                'id': s.id,
                'text': str(s)
            })
        return out


    class Meta:
        order_with_respect_to = 'lab'
        ordering = ['complexity', '_order', 'id']


class StudentTaskResult(MarkBaseModel):
    student = models.ForeignKey("Student")
    task = models.ForeignKey("StudentTask")
    done = models.BooleanField(default=False)

    @property
    def as_dict(self):
        return {
            'student': self.student_id,
            'task': self.task_id,
            'done': self.done,
            'group': self.student.group_id,
        }
