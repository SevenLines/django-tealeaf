from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.http.response import HttpResponse
from django.shortcuts import render
from django.template import RequestContext

from students.models import Student, Group


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

    return index(request)


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
    response = render(request, "students/students.html", context_instance=c)
    response.set_cookie("group_id", group_id)
    return response


@login_required
def remove(request):
    student_id = request.POST.get('student_id', -1)
    s = Student.objects.filter(pk=student_id).first()
    if s is not None:
        s.delete()

    return index(request)
