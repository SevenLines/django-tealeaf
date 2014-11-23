# coding:utf8
from django.db import transaction
from cms.models.pluginmodel import CMSPlugin
from django.db import models
from django.db.models.base import Model
from django.db.models.fields.related import ForeignKey
from django.forms.models import model_to_dict
from django.utils.translation import ugettext_lazy as _
from filer.fields.image import FilerImageField
from django.utils.text import Truncator
from ordered_model.models import OrderedModel

from students.models import Student, Discipline
from students.utils import current_year


class LabsList(CMSPlugin):
    discipline = models.ForeignKey(Discipline, on_delete=models.SET_NULL, null=True)


class Lab(OrderedModel):
    visible = models.BooleanField(default=True)
    description = models.TextField(blank=True, default="")
    discipline = models.ForeignKey(Discipline, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=200, blank=True, default="")
    order_with_respect_to = "discipline"
    # position = PositionField(collection='discipline')

    def to_dict(self, for_lab_control=False):
        d = model_to_dict(self)
        d['tasks'] = []
        for t in Task.objects.filter(lab=self).order_by("complexity", "id"):
            dt = model_to_dict(t)
            if for_lab_control:
                dt.update({
                    "users": list([{
                        'id': i['id'],
                        'text': "%s %s | %s" % (i['name'], i['second_name'], i['group__title'])
                    } for i in t.users().values("id", "name", "second_name", "group__title")])
                })
            else:
                dt["users"] = t.users()
            d['tasks'].append(dt)

        return d

    @staticmethod
    def all_to_dict(discipline_id=0, for_lab_control=False):
        if discipline_id == 0:
            labs = Lab.objects.all()
        elif discipline_id == -1:
            labs = Lab.objects.filter(discipline_id=None)
        else:
            labs = Lab.objects.filter(discipline_id=discipline_id)
        return list([l.to_dict(for_lab_control) for l in labs.order_by("order", "id")])

    class Meta(OrderedModel.Meta):
        pass


class Task(models.Model):
    lab = models.ForeignKey(Lab)

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

    complexity = models.IntegerField(max_length=20,
                                     choices=COMPLEX_CHOICES,
                                     default=EASY)

    description = models.TextField(blank=True, default="")

    def users(self, year=0):
        students = Student.objects

        if year == 0:
            year = current_year()

        if year != -1:
            students = students.filter(group__year=year)

        return students.filter(taskstudent__task_id=self.pk).order_by("second_name")


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
    # max_length=100, blank=True, default="")

    def copy_relations(self, oldinstance):
        students = oldinstance.users()
        self.set_users(list([s.id for s in students]))

    @transaction.atomic
    def set_users(self, users_id):
        TaskStudent.objects.filter(taskex_id=self.pk).delete()
        for user_id in users_id:
            t = TaskStudent(taskex_id=self.pk, student_id=int(user_id))
            t.save()

    def users(self, year=0):
        students = Student.objects

        if year == 0:
            year = current_year()

        if year != -1:
            students = students.filter(group__year=year)

        return students.filter(taskstudent__taskex_id=self.pk).order_by("second_name")

    def __unicode__(self):
        return unicode(Truncator(self.description).words(5, html=True))


class TaskStudent(Model):
    task = ForeignKey(Task, null=True)
    taskex = ForeignKey(TaskEx, null=True)
    student = ForeignKey(Student, null=True)


