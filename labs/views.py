from cms.api import add_plugin
from cms.models.placeholdermodel import Placeholder
from django.http.response import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.http import require_http_methods, require_POST

from labs.cms_plugins import TaskExPlugin
from labs.models import TaskEx, LabEx


@require_POST
@login_required
def update_task(request, pk):
    try:
        task = TaskEx.objects.get(pk=pk)
    except ObjectDoesNotExist:
        return HttpResponseBadRequest()

    if all(k in request.POST for k in ('user', 'complexity', )):
        task.user = request.POST['user']
        task.complexity = request.POST['complexity']
        if 'description' in request.POST:
            task.description = request.POST['description']
        task.save()

    page = task.placeholder.page if task.placeholder and task.placeholder.page else None
    context = {'task': task,
               'complex_choices': TaskEx.COMPLEX_CHOICES,
               'page': page,
               'is_gallery': 'is_gallery' in request.POST
               }

    return render(request, 'labs/task_info.html', context)


@require_POST
@login_required
def add_task(request, pk):
    if not all(k in request.POST for k in ("placeholder_id", "language", "lab_id")):
        return HttpResponseBadRequest()
    placeholder_id = request.POST['placeholder_id']
    language = request.POST['language']
    lab_id = request.POST['lab_id']

    lab = LabEx.objects.get(pk=lab_id)
    placeholder = Placeholder.objects.get(pk=placeholder_id)

    task = add_plugin(placeholder=placeholder,
                      plugin_type=TaskExPlugin,
                      language=language,
                      target=lab)
    page = task.placeholder.page
    context = {'task': task,
               'complex_choices': TaskEx.COMPLEX_CHOICES,
               'page': page,
               'is_gallery': 'is_gallery' in request.POST
               }

    return render(request, 'labs/task.html', context)


@require_POST
@login_required
def update_lab(request, pk):
    try:
        task = TaskEx.objects.get(pk=pk)
    except ObjectDoesNotExist:
        return HttpResponseBadRequest()

    if 'description' in request.POST:
        lab.description = request.POST['description']
        lab.visible = 'visible' in  request.POST
        lab.save()
        return HttpResponse()

    return HttpResponseBadRequest()