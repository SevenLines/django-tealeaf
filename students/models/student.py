# coding=utf-8
from django.db import models, transaction
from django.db.models.signals import post_delete
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.forms import model_to_dict
from students.utils import current_year


class Student(models.Model):
    SEX_UNDEFINED = -1
    SEX_WOMAN = 0
    SEX_MAN = 1

    SEX_ENUM = [
        (SEX_WOMAN, 'woman'),
        (SEX_WOMAN, 'woman'),
        (SEX_MAN, 'man'),
    ]

    name = models.CharField(max_length=50, default='')
    second_name = models.CharField(max_length=50, default='')
    group = models.ForeignKey("Group", null=True)
    sex = models.SmallIntegerField(choices=SEX_ENUM, default=SEX_UNDEFINED)

    phone = models.CharField(max_length=50, default='')
    email = models.EmailField(default='')
    vk = models.URLField(default='')

    photo = models.ImageField(upload_to="students", max_length=255, default='')

    def __unicode__(self):
        return u'{second_name} {name} | {group}'.format(**{
            'name': self.name,
            'second_name': self.second_name,
            'group': self.group.title,
        })

    def to_dict(self, authenticated=False):
        excluded = ['phone', 'email', 'vk', 'photo'] if not authenticated else []
        d = model_to_dict(self, exclude=excluded)
        if authenticated:
            d.update({
                'files': list([model_to_dict(i) for i in StudentFile.objects.filter(student=self)])
            })
        return d

    @staticmethod
    def year_students(year):
        from students.models.group import Group

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
        from students.models.discipline import Discipline
        from students.models.mark import Mark

        assert isinstance(discipline, Discipline)
        return Mark.objects.filter(lesson__discipline=discipline, student=self)


class StudentFile(models.Model):
    student = models.ForeignKey("Student")
    title = models.CharField(max_length=128, default="")
    description = models.TextField(default="")
    content_type = models.CharField(max_length=48, default="")
    blob = models.BinaryField(null=True)


def update_cache_student(instance):
    from students.models.discipline import DisciplineMarksCache

    DisciplineMarksCache.objects.filter(group=instance.group_id).delete()


@receiver(post_delete, sender=Student)
def student_delete_event(instance, **kwargs):
    instance.photo.delete(False)
    update_cache_student(instance)


@receiver(post_save, sender=Student)
def student_save_event(instance, **kwargs):
    update_cache_student(instance)
