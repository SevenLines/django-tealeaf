# coding=utf-8
import json

from django.contrib.auth.decorators import login_required
from django.db.transaction import atomic
from django.forms.models import model_to_dict
from django.http.response import HttpResponse
from django.shortcuts import render

from app.utils import require_in_POST, require_in_GET, json_encoder
from students.models import Lesson, Discipline, Group, Mark, DisciplineMarksCache


def index(request):
    return render(request, "students/marks_editor.html")


def students_cached(discipline_id, group_id):
    # таблица оценок для всех студентов группы загружается из кэша
    cache = json.loads(DisciplineMarksCache.get(discipline_id, group_id))
    return cache


@require_in_GET('discipline_id', 'group_id')
def students(request):
    return HttpResponse(students_cached(request.GET['discipline_id'], request.GET['group_id']),
                        content_type="json")


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
    l = Lesson.objects.get(pk=lesson_id)
    l.delete()
    return HttpResponse()


@login_required
@require_in_POST('lesson_id')
def lesson_save(request):
    l = Lesson.objects.get(pk=request.POST['lesson_id'])
    if 'lesson_type' in request.POST:
        l.lesson_type = request.POST['lesson_type']
    if 'description_raw' in request.POST:
        l.description = request.POST['description_raw']
    if 'date' in request.POST:
        l.date = request.POST['date']
    if 'multiplier' in request.POST:
        l.multiplier = float(request.POST['multiplier'])
    l.save()

    return HttpResponse(json.dumps(l.to_dict(), default=json_encoder), content_type="json")


@login_required
@require_in_POST('marks')
@atomic
def marks_save(request):
    marks = json.loads(request.POST['marks'])
    mark = None
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

    if mark:
        DisciplineMarksCache.update(mark.lesson.discipline_id, mark.lesson.group_id)

    return HttpResponse()
