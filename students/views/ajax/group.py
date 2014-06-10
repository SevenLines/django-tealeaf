from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.template import RequestContext

from students.models import Group, active_years
from students.utils import current_year


@login_required
def add(request):
    group = Group()
    group.title = request.POST['title']
    group.year = request.POST['year']
    group.save()

    return index(request)


@login_required
def update(request):
    group_id = request.POST.get('group_id', None)
    if group_id is not None:
        title = request.POST.get('title', None)
        year = request.POST.get('year', current_year())
        g = Group.objects.filter(pk=group_id).first()
        if g is not None:
            g.title = title
            g.year = year
            g.save()
    post = request.POST.copy();
    post['year'] = request.COOKIES.get('year', current_year())
    request.POST = post
    return index(request)


def index(request):
    y = request.POST.get('year', None)
    groups = Group.objects.filter(year=y) if y is not None else Group.objects.all()

    c = RequestContext(request, {
        'groups': groups,
        'year': y,
        'years': active_years(),
    })
    response = render(request, "students/groups.html", context_instance=c)

    group_id = request.COOKIES.get('group_id', None)
    if group_id is None:
        g = groups.first()
        if g is not None:
            response.set_cookie('group_id', g.pk)
    response.set_cookie('year', y)

    return response


def remove(request):
    group_id = request.POST.get('group_id_delete', None)
    if group_id is not None:
        g = Group.objects.filter(pk=group_id).first()
        if g is not None:
            # assert isinstance(g, Group)
            g.delete()
    return index(request)