from django.http.response import HttpResponse
from django.shortcuts import render
from django.template.context import RequestContext
from students.models import Discipline


def add(request):
    return HttpResponse()


def remove(request):
    return HttpResponse()


def index(request):
    disciplines = Discipline.objects.all()
    c = RequestContext({
        'disciplines': disciplines,
    })
    r = render(request, "students/labs/info.html")
    return HttpResponse()


def update(request):
    return HttpResponse()