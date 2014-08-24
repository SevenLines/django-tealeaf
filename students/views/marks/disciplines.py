import json

from django.contrib.auth.decorators import login_required
from django.http.response import HttpResponse, HttpResponseBadRequest
from django.views.decorators.http import require_POST

from students.models import Discipline


def index(request):
    return HttpResponse(json.dumps(list(Discipline.objects.all().values())), content_type="json")


@require_POST
@login_required
def remove(request):
    if "id" not in request.POST:
        return HttpResponseBadRequest("'id' is not defined")

    try:
        Discipline.objects.get(pk=request.POST['id']).delete()
    except BaseException as e:
        return HttpResponseBadRequest(e.message)

    return HttpResponse()


@require_POST
@login_required
def add(request):
    if "title" not in request.POST:
        return HttpResponseBadRequest("'title' is not defined")

    d = Discipline()
    d.title = request.POST['title']
    d.save()

    return HttpResponse()

@require_POST
@login_required
def edit(request):
    if "id" not in request.POST:
        return HttpResponseBadRequest("'id' is not defined")

    d = Discipline.objects.get(pk=request.POST["id"])
    if "title" in request.POST:
        d.title = request.POST['title']

    d.save()

    return HttpResponse()
