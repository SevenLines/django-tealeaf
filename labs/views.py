from django.shortcuts import render, get_object_or_404
from labs.cms_plugins import textile_without_p

from labs.models import TaskEx
from django.contrib.auth.decorators import login_required

@login_required(login_url="/admin/")
def update_task(request, pk):
    task = get_object_or_404(TaskEx, pk=pk)

    if 'user' in request.POST and 'complexity' in request.POST:
        task.user = request.POST['user']
        task.complexity = request.POST['complexity']
        task.save()

    context = {'task': task,
               'complex_choices': TaskEx.COMPLEX_CHOICES}
    task.description = textile_without_p(task.description)

    return render(request, 'labs/task.html', context)