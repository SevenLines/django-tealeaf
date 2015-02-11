# coding=utf-8
import json

from django.contrib.auth.decorators import login_required
from django.forms.models import model_to_dict
from django.http.response import HttpResponse, HttpResponseBadRequest
from django.views.decorators.http import require_POST
from app.utils import require_in_POST
from students.models.discipline import Discipline
from students.utils import current_year


def index(request):
    # список дисциплин
    if not request.user.is_authenticated():
        # если неатутентифицирован
        disciplines = Discipline.objects.raw("""
SELECT DISTINCT sd.*
FROM students_discipline sd
  LEFT JOIN students_lesson sl ON sl.discipline_id = sd.id
  LEFT JOIN students_group sg ON sg.id = sl.group_id
  WHERE sg.year = %(year)s AND sd.visible
    """, {
            'year': current_year()
        })
    else:
        # иначе весь список
        disciplines = Discipline.objects.all()

    disciplines = list([model_to_dict(d) for d in disciplines])

    return HttpResponse(json.dumps(disciplines), content_type="json")


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
    if "visible" in request.POST:
        d.visible = request.POST['visible'] == 'true'

    d.save()

    return HttpResponse()
