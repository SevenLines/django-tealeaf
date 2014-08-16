# coding:utf8
from django.db import transaction
from cms.models.pluginmodel import CMSPlugin
from django.db import models
from django.db.models.base import Model
from django.db.models.fields.related import ForeignKey
from django.utils.translation import ugettext_lazy as _
from filer.fields.image import FilerImageField
from django.utils.text import Truncator

from students.models import Student
from students.utils import current_year


def users_for_task(task_id, year=-1):
    if year == -1:
        year = current_year()
    return Student.objects.filter(group__year=year)\
        .filter(taskstudent__taskex_id=task_id).order_by("second_name")


@transaction.atomic
def set_users_for_task(task_id, users_id):
    TaskStudent.objects.filter(taskex_id=task_id).delete()
    for user_id in users_id:
        t = TaskStudent(taskex_id=task_id, student_id=int(user_id))
        t.save()


class LabEx(CMSPlugin):
    class Meta:
        pass

    TEXT = "text"
    GALLERY = "gallery"

    TYPE_CHOICES = (
        (TEXT, _("text")),
        (GALLERY, _("gallery")),
    )

    render_style = models.CharField(max_length=50,
                                    choices=TYPE_CHOICES,
                                    default=TEXT)
    visible = models.BooleanField(default=True)
    title = models.CharField(max_length=200, blank=True, default="")
    description = models.TextField(blank=True, default="")

    def __unicode__(self):
        return unicode(self.title)


class TaskEx(CMSPlugin):
    UNDEFINED = ""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    NIGHTMARE = "nightmare"

    COMPLEX_CHOICES = (
        (UNDEFINED, _("")),
        (EASY, _("Easy")),
        (MEDIUM, _("Medium")),
        (HARD, _("Hard")),
        (NIGHTMARE, _("Nightmare")),
    )

    complexity = models.CharField(max_length=20,
                                  choices=COMPLEX_CHOICES,
                                  default=EASY)

    description = models.TextField(blank=True, default="текст задачи...")
    image = FilerImageField(null=True, blank=True, default=None, verbose_name="image")

    # user = models.CharField(verbose_name="name of user",
    #                         max_length=100, blank=True, default="")

    def copy_relations(self, oldinstance):
        students = users_for_task(oldinstance.pk)
        set_users_for_task(self.pk, list([s.id for s in students]))

    users = models.ManyToManyField("students.Student", db_table="TaskStudent", db_constraint=True,
                                   blank=True, default=None, null=True)

    def __unicode__(self):
        return unicode(Truncator(self.description).words(5, html=True))


class TaskStudent(Model):
    taskex = ForeignKey(TaskEx)
    student = ForeignKey(Student)


