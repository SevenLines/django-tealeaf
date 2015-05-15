# coding=utf-8
from django.contrib.auth.models import User, AnonymousUser
from django.db import models

# Create your models here.
from students.models.discipline import Discipline


def is_admin(user):
    if isinstance(user, AnonymousUser):
        return False
    return user.is_superuser or user.profile.is_admin


def can_edit(user, discipline):
    """
    :param user:
    :param discipline: id or discipline instance object
    :return: True if user has access to this discipline
    """
    if isinstance(discipline, Discipline):
        discipline_pk = discipline.pk
    else:
        discipline_pk = discipline

    if isinstance(user, AnonymousUser):
        return False
    return user.is_superuser \
           or user.profile.is_admin \
           or (user.profile.disciplines and user.profile.disciplines.objects.filter(pk=discipline_pk).exists())


User.profile = property(lambda u: UserProfile.objects.get_or_create(user=u)[0])
User.add_to_class('is_admin', property(is_admin))
User.add_to_class('can_edit', property(can_edit))


class UserProfile(models.Model):
    user = models.ForeignKey(User, unique=True)
    is_admin = models.BooleanField(default=False, help_text="Админ имеет право добавлять/удалять дисциплины")
    disciplines = models.ManyToManyField(Discipline, null=True, blank=True, default=None,
                                         help_text="Дисциплина к которой пользователь имеет доступ")