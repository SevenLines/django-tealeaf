from cms.api import add_plugin
from cms.models.placeholdermodel import Placeholder
from django.http.response import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required

# from labs.cms_plugins import textile_without_p
from labs.cms_plugins import TaskExPlugin
from labs.models import TaskEx, LabEx


@login_required
def update_task(request, pk):
    task = get_object_or_404(TaskEx, pk=pk)

    if all(k in request.POST for k in ('user', 'complexity', 'description')):
        task.user = request.POST['user']
        task.complexity = request.POST['complexity']
        task.description = request.POST['description']
        task.save()

    page = task.placeholder.page
    context = {'task': task,
               'complex_choices': TaskEx.COMPLEX_CHOICES,
               'page': page, }

    return render(request, 'labs/task_info.html', context)


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
               'page': page, }

    return render(request, 'labs/task.html', context)


@login_required
def update_lab(request, pk):
    lab = get_object_or_404(LabEx, pk=pk)

    if 'description' in request.POST:
        lab.description = request.POST['description']
        lab.save()

    return HttpResponse()


@login_required
def update_task_gallery(request, pk):
    task = get_object_or_404(TaskEx, pk=pk)

    if all(k in request.POST for k in ('user', 'complexity', 'description')):
        task.user = request.POST['user']
        task.complexity = request.POST['complexity']
        task.description = request.POST['description']
        task.save()
        # else:
        # return HttpResponseBadRequest()

        # # revert draft page if editing in live page
        # page = task.placeholder.page
        # if not page.publisher_is_draft:
        # page = page.get_draft_object()
        # page.revert(page.languages)
        #
        # context = {'task': task,
        #            'complex_choices': TaskEx.COMPLEX_CHOICES,
        #            'page': page, }
        # task.description = task.description
        #
        # return render(request, 'labs/task_img.html', context)