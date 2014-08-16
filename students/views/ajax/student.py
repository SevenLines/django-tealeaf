# coding=utf-8
import json

from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.http.response import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render
from django.template import RequestContext
from django.db.models import Q
from django.views.decorators.http import require_POST, require_GET

from students.models import Student, Group


@require_GET
@login_required
def list_students(request):
    task_id = request.GET.get("task_id", None)

    # если передали task_id, то возвращаем список студентов
    if task_id is not None:
        students = Student.objects.filter(taskstudent__taskex_id=task_id)
    # иначе отфильтрованный результат
    else:
        f = request.GET.get("filter", None)
        if f is None:
            return HttpResponseBadRequest()
        students = Student.objects.filter(Q(second_name__icontains=f) | Q(name__icontains=f))[:10]

    students = list([{"id": i.pk, "text": "%s %s" % (i.name, i.second_name)} for i in students])
    return HttpResponse(json.dumps(students), content_type="application/json")


@require_POST
@login_required
def add(request):
    name = request.POST['name']
    second_name = request.POST['second_name']
    group_id = request.POST.get('group_id', None)
    group = Group.objects.filter(pk=group_id).first()

    if group is not None:
        if 'student_id' in request.POST:
            s = Student.objects.filter(pk=request.POST['student_id']).first()
            s.name = name
            s.second_name = second_name
            s.group = group
        else:
            s = Student(name=name, second_name=second_name, group=group)
        if s:
            s.save()
    return HttpResponse()
    # return index(request)


def index(request):
    group_id = request.POST.get('group_id', None)

    group = Group.objects.filter(pk=group_id).first()

    if not isinstance(group, Group):
        raise Http404

    stdnts = Student.objects.filter(group=group)

    if group_id > 0:
        c = RequestContext(request, {
            'students': stdnts,
            'group': group,
        })
    else:
        return HttpResponse()
    response = render(request, "students/students/students.html", context_instance=c)
    response.set_cookie("group_id", group_id)
    return response


@require_POST
@login_required
def remove(request):
    student_id = request.POST.get('student_id', -1)
    s = Student.objects.filter(pk=student_id).first()
    if s is not None:
        s.delete()
    return HttpResponse()
    # return index(request)
