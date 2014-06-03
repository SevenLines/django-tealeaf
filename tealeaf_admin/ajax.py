# coding:utf-8
from datetime import date
from django.contrib.auth.decorators import login_required

from django.http.response import Http404
from django.shortcuts import render
from django.template import RequestContext

from students.models import Student, Lesson, Group, Discipline, Mark


@login_required(login_url="login/")
def add_lesson(request):
    group_id = request.GET['group_id']
    discipline_id = request.GET['discipline_id']

    date_ordinal = request.GET['date_ordinal']
    d = date.fromordinal(date_ordinal)

    group = Group.objects.get(pk=group_id)
    discipline = Discipline.objects.get(pk=discipline_id)

    l = group.lessons(discipline).filter(date=d).first()
    if l is not None:
        l.date = date.fromordinal(date_ordinal)
    else:
        l = Lesson.create_lesson_for_group(group, discipline)
        l.date = d
    l.save()
    return l
