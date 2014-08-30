# coding=utf-8
import json

from django.contrib.auth.decorators import login_required
from django.db.transaction import atomic
from django.forms import model_to_dict
from django.http.response import HttpResponse
from django.shortcuts import render



# @login_required
from app.utils import require_in_POST, require_in_GET, json_dthandler
from students.models import Lesson, Discipline, Group, Mark


def index(request):
    return render(request, "students/marks_editor.html")


@require_in_GET('discipline_id', 'group_id')
def students(request):
    group_id = request.GET['group_id']
    discipline_id = request.GET['discipline_id']

    # таблица оценок для всех студентов группы
    marks = Discipline.objects.get(pk=discipline_id).marks(group_id)

    # конвертируем оценки в список
    marks = list([{"sid": m.student_id,
                   "mid": m.id,
                   "lid": m.lesson_id,
                   "m": m.mark} for m in marks])

    # студенты группы
    stdnts = Group.objects.get(pk=request.GET['group_id']).students.all().order_by("second_name")
    stdnts = list([model_to_dict(s) for s in stdnts])
    for s in stdnts:
        # формируем оценки для студентов
        s_marks = list(filter(lambda m: m['sid'] == s['id'], marks))
        s_sum = sum([m['m'] for m in s_marks if m['m']], 0)
        s.update({
            'marks': s_marks,
            'sum': s_sum
        })

    lessons = list(Lesson.objects.filter(group__pk=group_id, discipline__id=discipline_id)
                   .order_by("date", "id"))
    lessons = list([{"id": l.id,
                     "lt": l.lesson_type if l.lesson_type else None,
                     "dt": l.date,
                     "dn": l.description
                    } for l in lessons])

    #  виды занятий
    lesson_types = list([{'id': t[0], 'title': t[1]} for t in Lesson.LESSON_TYPES])
    #  виды оценок
    mark_types = list([{'k': t[0], 'v': t[1]} for t in Mark.MARKS])

    # формируем ответ
    return HttpResponse(json.dumps(
        {'lessons': lessons,
         'students': stdnts,
         'lesson_types': lesson_types,
         'mark_types': mark_types,
        }, default=json_dthandler), content_type="json")


@login_required
@require_in_POST('discipline_id', 'group_id')
def lesson_add(request):
    d = Discipline.objects.get(pk=request.POST['discipline_id'])
    g = Group.objects.get(pk=request.POST['group_id'])

    l = Lesson()
    l.discipline = d
    l.group = g
    l.save()

    return HttpResponse()


@login_required
@require_in_POST('lesson_id')
def lesson_remove(request):
    lesson_id = request.POST['lesson_id']
    Lesson.objects.get(pk=lesson_id).delete()
    return HttpResponse()


@login_required
@require_in_POST('lesson_id')
def lesson_save(request):
    l = Lesson.objects.get(pk=request.POST['lesson_id'])
    if 'lesson_type' in request.POST:
        l.lesson_type = request.POST['lesson_type']
    if 'description' in request.POST:
        l.description = request.POST['description']
    if 'date' in request.POST:
        l.date = request.POST['date']
    l.save()
    return HttpResponse()


@login_required
@require_in_POST('marks')
@atomic
def marks_save(request):
    marks = json.loads(request.POST['marks'])
    for m in marks:
        mark = Mark.objects.filter(lesson__id=m['lesson_id'],
                                   student__id=m['student_id']).first()
        if m['mark'] == Mark.MARK_NORMAL:
            mark.delete()
        else:
            if mark is None:
                mark = Mark()
                mark.lesson_id = m['lesson_id']
                mark.student_id = m['student_id']
            mark.mark = m['mark']
            mark.save()

    return HttpResponse()
