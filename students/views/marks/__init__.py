# coding=utf-8
import json

from django.contrib.auth.decorators import login_required
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
    marks = list(Mark.objects.raw("""
SELECT s.id as student_id, l.lesson_id, date, sm.id as id, mark
FROM students_student s
  LEFT JOIN (SELECT id as lesson_id, date
        FROM students_lesson sl
        WHERE group_id = %(group_id)s and discipline_id = %(discipline_id)s) l ON true
  LEFT JOIN students_mark sm ON l.lesson_id = sm.lesson_id and s.id = sm.student_id
WHERE s.group_id = %(group_id)s and l.lesson_id is not NULL
  ORDER BY s.id, l.date
      """, {
        'group_id': group_id,
        'discipline_id': discipline_id
    }))

    # конвертируем оценки в список
    marks = list([{"student_id": m.student_id,
                   "mark_id": m.id,
                   "lesson_id": m.lesson_id,
                   "mark": m.mark} for m in marks])

    # студенты группы
    stdnts = Group.objects.get(pk=request.GET['group_id']).students.all().order_by("second_name")
    stdnts = list([model_to_dict(s) for s in stdnts])
    for s in stdnts:
        # формируем оценки для студентов
        s.update({
            'marks': list(filter(lambda m: m['student_id'] == s['id'], marks))
        })

    lessons = list(Lesson.objects.filter(group__pk=group_id, discipline__id=discipline_id) \
                   .order_by("date"))

    # формируем ответ
    return HttpResponse(json.dumps(
        {'lessons': list([model_to_dict(l) for l in lessons]),
         'students': stdnts},
        default=json_dthandler), content_type="json")


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
def lesson_edit(request):
    pass


@require_in_POST('discipline_id', 'group_id')
def lesson_list(request):
    pass


@login_required
@require_in_POST('marks')
def marks_save(request):
    marks = json.loads(request.POST['marks'])
    for m in marks:
        print m
        mark = Mark.objects.filter(lesson__id=m['lesson_id'],
                                   student__id=m['student_id']).first()
        if mark is None:
            mark = Mark()
            mark.lesson_id = m['lesson_id']
            mark.student_id = m['student_id']
        mark.mark = m['mark']
        mark.save()

    return HttpResponse()
