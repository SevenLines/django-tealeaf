import json

from django.contrib.auth.decorators import login_required
from django.http.response import HttpResponse, HttpResponseBadRequest
from django.views.decorators.http import require_POST

from app.utils import require_in_POST

from students.models import Discipline


def index(request):
    return HttpResponse(json.dumps(list(Discipline.objects.all().values())), content_type="json")


@require_POST
@login_required
@require_in_POST("id")
def remove(request):
    try:
        Discipline.objects.get(pk=request.POST['id']).delete()
    except BaseException as e:
        return HttpResponseBadRequest(e.message)

    return HttpResponse()


@require_POST
@login_required
@require_in_POST("title")
def add(request):
    d = Discipline()
    d.title = request.POST['title']
    d.save()

    return HttpResponse()


@require_POST
@login_required
@require_in_POST("id")
def edit(request):
    d = Discipline.objects.get(pk=request.POST["id"])
    if "title" in request.POST:
        d.title = request.POST['title']

    d.save()

    return HttpResponse()
