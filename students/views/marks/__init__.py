# coding=utf-8
import io
import json

from django.contrib.auth.decorators import login_required
from django.db.transaction import atomic
from django.forms.models import model_to_dict
from django.http.response import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render
import xlsxwriter
import xlsxwriter.worksheet
import students.utils

from app.utils import require_in_POST, require_in_GET, json_encoder
from students.models import Lesson, Discipline, Group, Mark, DisciplineMarksCache, Student


def index(request):
    return render(request, "students/marks_editor.html")


def students_cached(discipline_id, group_id):
    # таблица оценок для всех студентов группы загружается из кэша
    cache = json.loads(DisciplineMarksCache.get_json(discipline_id, group_id))
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
        if m['mark'] == Mark.MARK_BASE:
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


@require_in_GET("group_id", "discipline_id")
def marks_to_excel(request):
    try:
        group = Group.objects.get(pk=request.GET['group_id'])
    except Exception as e:
        return HttpResponseBadRequest("cant find group with id=%s" % request.GET['group_id'])

    # if Discipline.objects.filter(pk=request.GET['discipline_id']).first():
    # return HttpResponseBadRequest("cant find discipline with id=%s" % request.GET['discipline_id'])

    excel = DisciplineMarksCache.get_excel(request.GET['discipline_id'], request.GET['group_id'])

    response = HttpResponse(excel, content_type="application/xlsx")
    response['Content-Disposition'] = 'attachment; filename=%s.xlsx' % group.title

    return response


@require_in_GET("year", "discipline_id")
def students_control(request):
    """
    Промежуточная атестация студентов
    :param request:
    """
    grps = Group.year_groups(request.GET['year']).order_by('title')

    output = io.BytesIO()
    xls = xlsxwriter.Workbook(output, {'in_memory': True})
    sheet = xls.add_worksheet()
    # assert isinstance(sheet, xlsxwriter.worksheet.Worksheet)

    frmt = xls.add_format()
    frmt.set_align("center")
    frmt.set_align("vcenter")
    frmt.set_border()

    frmt_header = xls.add_format()
    frmt_header.set_bold()
    frmt_header.set_align("center")
    frmt_header.set_align("vcenter")
    frmt_header.set_bg_color("#EEEEEE")
    frmt_header.set_border()

    for i, g in enumerate(grps):
        cache = json.loads(json.loads(DisciplineMarksCache.get_json(request.GET['discipline_id'], g.pk)))
        students = cache['students']
        sheet.merge_range(0, i * 2, 0, i * 2 + 1, g.title, frmt_header)
        max_len = 0
        for j, s in enumerate(students):
            if len(s['second_name']) > max_len:
                max_len = len(s['second_name'])

            sheet.write(j + 1, i * 2, s['second_name'], frmt)
            score = Discipline.compute_percents(s['marks'])
            score *= 0.5
            score = int(score*100)
            result = score if s['sum'] >= 0 else u'н/а'
            sheet.write(j + 1, i * 2 + 1, result, frmt)

        sheet.set_column(i*2, i*2, width=max_len*1.1)

    sheet.set_landscape()
    sheet.fit_to_pages(1, 1)

    xls.close()
    output.seek(0)

    r = HttpResponse(output, content_type="application/xlsx")
    r['Content-Disposition'] = 'attachment; filename=%s.xlsx' % request.GET['year']

    return r


