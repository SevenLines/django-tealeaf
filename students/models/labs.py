from django.db import models


class StudentLab(models.Model):
    class Meta:
        managed = True

    title = models.CharField(max_length=100, default='')
    description = models.TextField(default='')
    discipline = models.ForeignKey('Discipline')
    order = models.SmallIntegerField(default=0)


class StudentTask(models.Model):
    class Meta:
        managed = True

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