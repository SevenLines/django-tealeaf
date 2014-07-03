from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required

# from labs.cms_plugins import textile_without_p
from labs.models import TaskEx


@login_required(login_url="/admin/")
def update_task(request, pk):
    task = get_object_or_404(TaskEx, pk=pk)

    if 'user' in request.POST and 'complexity' in request.POST:
        task.user = request.POST['user']
        task.complexity = request.POST['complexity']
        task.save()

    # revert draft page if editing in live page
    page = task.placeholder.page
    if not page.publisher_is_draft:
        page = page.get_draft_object()
        page.revert(page.languages)

    context = {'task': task,
               'complex_choices': TaskEx.COMPLEX_CHOICES,
               'page': page, }
    task.description = task.description

    return render(request, 'labs/task.html', context)


@login_required(login_url="/admin/")
def update_task_gallery(request, pk):
    task = get_object_or_404(TaskEx, pk=pk)

    if 'user' in request.POST and 'complexity' in request.POST:
        task.user = request.POST['user']
        task.complexity = request.POST['complexity']
        task.save()

    # revert draft page if editing in live page
    page = task.placeholder.page
    if not page.publisher_is_draft:
        page = page.get_draft_object()
        page.revert(page.languages)

    context = {'task': task,
               'complex_choices': TaskEx.COMPLEX_CHOICES,
               'page': page, }
    task.description = task.description

    return render(request, 'labs/task_img.html', context)