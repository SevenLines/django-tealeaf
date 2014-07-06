from django.shortcuts import render
from django.template.context import RequestContext

from students.models import active_years
from students.utils import current_year


__author__ = 'mick'


def index(request):
    years = active_years()
    c = RequestContext(request, {
        'years': years,
        'year': current_year(),
    })

    response = render(request, "students/students/years.html", context_instance=c)

    year = request.COOKIES.get('year', None)
    if year is None:
        response.set_cookie('year', current_year())

    return response