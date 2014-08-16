from django.contrib.auth.decorators import login_required
from django.http.response import Http404, HttpResponse
from django.shortcuts import render
from django.template import RequestContext
from django.views.decorators.http import require_POST

from students.models import Group, active_years
from students.utils import current_year


@require_POST
@login_required
def add(request):
    group = Group()
    if 'title' in request.POST and 'year' in request.POST:
        group.title = request.POST['title']
        group.year = request.POST['year']
        group.save()
    return HttpResponse()
    # return index(request)


@require_POST
@login_required
def update(request):
    if 'group_id' in request.POST:
        g = Group.objects.filter(pk=request.POST['group_id']).first()
        if g is not None:
            if 'title' in request.POST:
                g.title = request.POST['title']
            if 'year' in request.POST:
                g.year = request.POST['year']
            g.save()

    # hook POST year reset to cookies value
    post = request.POST.copy()
    post['year'] = request.COOKIES.get('year', current_year())
    request.POST = post
    return HttpResponse()
    # return index(request)


@require_POST
@login_required
def copy_to_next_year(request):
    group_id = request.POST['group_id']
    g = Group.objects.filter(pk=group_id).first()
    if g is not None:
        g.copy_to_next_year()
    return HttpResponse()


def index(request):
    data = {
        'years': active_years()
    }

    if 'year' in request.POST:
        y = request.POST['year']

        groups = Group.objects.filter(year=y)

        data['year'] = y
        data['groups'] = groups
    else:
        raise Http404

    c = RequestContext(request, data)
    response = render(request, "students/students/groups.html", context_instance=c)

    group_id = request.COOKIES.get('group_id', None)
    if group_id is None:
        g = groups.first()
        if g is not None:
            response.set_cookie('group_id', g.pk)

    response.set_cookie('year', y)
    return response


@require_POST
@login_required
def remove(request):
    group_id = request.POST.get('group_id_delete', None)
    if group_id is not None:
        g = Group.objects.filter(pk=group_id).first()
        if g is not None:
            # assert isinstance(g, Group)
            g.delete()
    return HttpResponse()
    # return index(request)