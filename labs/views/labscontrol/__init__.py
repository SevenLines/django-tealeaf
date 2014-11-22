# coding=utf-8
# ## LABS ###

from django.contrib.auth.decorators import login_required
from django.forms.models import model_to_dict
from django.http.response import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render

from app.utils import require_in_POST
from labs.models import Lab, Task
from students.models import Discipline


def labs(request):
    labs_list = None
    if "lab_id" in request.POST:
        lab = Lab.objects.get(pk=int(request.POST['lab_id']))
        labs_list = [lab.to_dict()]
    elif "discipline_id" in request.POST:
        labs_list = Lab.all_to_dict(int(request.POST['discipline_id']))

    context = {
        'labs': labs_list if labs_list else [],
        'complex_choices': Task.COMPLEX_CHOICES,
        'editable': request.user.is_authenticated() and labs_list is not None and len(labs_list) == 1,
        'show_opened': labs_list is not None and len(labs_list) <= 1
    }
    return render(request, "labs-control/labs-preview.html", context)


# @login_required
def labs_editor(request):
    disciplines = list([model_to_dict(d) for d in Discipline.objects.all()])
    disciplines.append(model_to_dict(Discipline(id=-1, title="неактивные")))
    for d in disciplines:
        d.update(labs=Lab.all_to_dict(d['id']))
    context = {
        'disciplines': disciplines
    }
    return render(request, "labs-control/labs.html", context)


@login_required
def tree(request):
    disciplines = list([model_to_dict(d) for d in Discipline.objects.all()])
    disciplines.append(model_to_dict(Discipline(id=-1, title="неактивные")))
    for d in disciplines:
        d.update(labs=Lab.all_to_dict(d['id']))
    context = {
        'disciplines': disciplines
    }
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

    lab.save()

    return HttpResponse()


@login_required
def remove_lab(request, id):
    Lab.objects.get(pk=id).delete()

    return HttpResponse()


@require_in_POST("pk")
@login_required
def update_lab(request):
    lab = Lab.objects.filter(pk=request.POST['pk']).first()
    if not lab:
        return HttpResponseBadRequest("Lab with pk=%s doesn't exist" % request.POST['pk'])

    assert isinstance(lab, Lab)

    if 'position' in request.POST:
        lab.to(int(request.POST['position']))

    if 'discipline_id' in request.POST:
        if lab.discipline_id != request.POST['discipline_id']:
            lab.discipline_id = int(request.POST['discipline_id'])
            if lab.discipline_id == -1:
                lab.discipline_id = None

    if 'title' in request.POST:
        if lab.title != request.POST['title']:
            lab.title = request.POST['title']

    if 'description' in request.POST:
        if lab.description != request.POST['description']:
            lab.description = request.POST['description']

    lab.save()

    return HttpResponse()


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

    return HttpResponse()


def remove_task(request, id):
    Task.objects.get(pk=id).delete()
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