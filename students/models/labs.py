from django.db import models


class Lab(models.Model):
    title = models.CharField(max_length=100, default='')
    description = models.TextField(default='')
    discipline = models.ForeignKey('students.models.discipline.Discipline')


class Task(models.Model):
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

    lab = models.ForeignKey('Lab')
    complexity = models.IntegerField(max_length=20,
                                     choices=COMPLEX_CHOICES,
                                     default=EASY)

    description = models.TextField(default="")