from django.contrib.auth.decorators import login_required
from django.http.response import HttpResponse
from django.shortcuts import render_to_response
from app.utils import require_in_POST, update_post_object
from labs.models import Task

__author__ = 'm'


@login_required
@require_in_POST('id')
def save(request):
    update_post_object(request, Task, *['description', 'complexity'])
    return HttpResponse()


@require_in_POST('id')
def show(request):
    pass


@login_required
@require_in_POST('id')
def delete(request):
    return render_to_response('delete.html')


def index(request):
    pass


@login_required
def new(request):
    pass