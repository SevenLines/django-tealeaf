# coding=utf-8
# ## LABS ###
import json

from django.contrib.auth.decorators import login_required
from django.forms.models import model_to_dict
from django.http.response import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render
import itertools

from app.utils import require_in_POST
from labs.models import Lab, Task, TaskStudent
from labs.views.labscontrol import _ajax

#
# def labs(request):
# labs_list = None
# if "lab_id" in request.POST:
#         lab = Lab.objects.get(pk=int(request.POST['lab_id']))
#         labs_list = [lab.to_dict()]
#     elif "discipline_id" in request.POST:
#         labs_list = Lab.all_to_dict(int(request.POST['discipline_id']))
#
#     context = {
#         'labs': labs_list if labs_list else [],
#         'complex_choices': Task.COMPLEX_CHOICES,
#     }
#     return render(request, "labs-control/labs-preview.html", context)
from students.models import Group
from students.models.discipline import Discipline


def tree_context(request):
    disciplines = list([model_to_dict(d) for d in Discipline.objects.all()])
    for d in disciplines:
        d.update(labs=Lab.all_for_discipline(d['id']))

    years = itertools.groupby([model_to_dict(g) for g in Group.objects.all()], lambda x: x['year'])
    years = [{'year': i[0], 'groups': list(i[1])} for i in years]
    for y in years:
        for g in y['groups']:
            g.update(labs=Lab.all_for_group(g['id']))

    context = {
        'disciplines': disciplines,
        'years': years,
        'unsorted': {
            'labs': Lab.objects.filter(discipline=None, group=None),
        },
    }

    return context


@login_required
def labs_editor(request):
    context = tree_context(request)
    return render(request, "labs-control/labs-editor.html", context)


@login_required
def tree(request):
    context = tree_context(request)
    return render(request, "labs-control/labs-tree-items.html", context)


@login_required
def add_lab(request):
    lab = Lab()

    if 'description' in request.POST:
        lab.description = request.POST['description']

    if 'title' in request.POST:
        lab.title = request.POST['title']

    if 'discipline_id' in request.POST:
        discipline_id = int(request.POST['discipline_id'])
        if discipline_id > 0:
            lab.discipline_id = discipline_id

    if 'group_id' in request.POST:
        group_id = int(request.POST['group_id'])
        if group_id > 0:
            lab.group_id = group_id

    lab.save()

    return HttpResponse()


@require_in_POST("pk")
@login_required
def remove_lab(request):
    Lab.objects.get(pk=int(request.POST['pk'])).delete()
    return HttpResponse()


@require_in_POST("pk")
@login_required
def update_lab(request):
    return _ajax.update_lab(request)


@require_in_POST("pk")
@login_required
def publish_lab(request):
    pass


# ## TASKS ###
@require_in_POST("lab_id")
@login_required
def add_task(request):
    task = Task()
    if 'description' in request.POST:
        task.description = request.POST['description']

    task.lab_id = request.POST['lab_id']

    task.save()

    return HttpResponse(json.dumps(model_to_dict(task)), content_type="json")


@login_required
@require_in_POST("pk")
def remove_task(request):
    Task.objects.get(pk=int(request.POST['pk'])).delete()
    return HttpResponse()


@require_in_POST("pk")
@login_required
def update_task(request):
    task = Task.objects.filter(pk=request.POST['pk']).first()
    if not task:
        return HttpResponseBadRequest("Task with pk=%s doesn't exist" % request.POST['pk'])

    assert isinstance(task, Task)

    if 'position' in request.POST:
        task.position = int(request.POST['position'])

    if 'complexity' in request.POST:
        task.complexity = request.POST['complexity']

    if 'remove_users' in request.POST and int(request.POST['remove_users']) == 1:
        TaskStudent.objects.filter(task=task.pk).delete()
    elif 'users[]' in request.POST:
        TaskStudent.objects.filter(task=task.pk).delete()
        for u_id in request.POST.getlist("users[]"):
            tu = TaskStudent()
            tu.task = task
            tu.student_id = int(u_id)
            tu.save()

    if 'lab_id' in request.POST:
        if task.lab_id != request.POST['lab_id']:
            task.lab_id = request.POST['lab_id']

    if 'description' in request.POST:
        if task.description != request.POST['description']:
            task.description = request.POST['description']

    task.save()

    return HttpResponse()


def publish_task(request):
    pass