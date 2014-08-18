import json

from django.contrib.auth.decorators import login_required
from django.db.transaction import atomic
from django.http import HttpResponse
from django.http.response import HttpResponseBadRequest
from django.views.decorators.http import require_POST

from students.models import active_years, Group, Student


def blank(request):
    return HttpResponse()


@login_required
def years(request):
    yrs = list([{'year': y} for y in active_years()])
    return HttpResponse(json.dumps(yrs), mimetype='application/json')


@login_required
def groups(request):
    year = request.POST.get('year', None)
    year = request.GET.get('year', None) if year is None else year
    # year = int(year)
    # if year is None:
    # return HttpResponseBadRequest("'year' parameter is not defined")

    grps = Group.objects.all()

    if year:
        grps = grps.filter(year=year)
    return HttpResponse(json.dumps(list(grps.values())), mimetype='application/json')


@atomic
def update_students_data(students_list):
    # treat deleted items
    for s in students_list:
        if '_destroy' in s and s['id'] != -1:  # destroyed items
            Student.objects.filter(pk=s['id']).delete()
        if s['modified'] and s['id'] != -1:  # modifieded items
            student = Student.objects.filter(pk=s['id']).first()
            if s is not None:
                student.name = s['name']
                student.second_name = s['second_name']
                student.save()
        if s['id'] == -1:  # new items
            student = Student()
            student.group_id = s['group_id']
            student.name = s['name']
            student.second_name = s['second_name']
            student.save()


@require_POST
@login_required
def save_students(request):
    try:
        stdnts = json.loads(request.POST['students'])
    except Exception as e:
        return HttpResponseBadRequest(e.message)

    try:
        update_students_data(stdnts)
    except Exception as e:
        return HttpResponseBadRequest(e.message)

    return HttpResponse()


@require_POST
@login_required
@atomic
def save_groups(request):
    try:
        grps = json.loads(request.POST['groups'])
    except Exception as e:
        return HttpResponseBadRequest(e.message)


@login_required
def students(request):
    group_id = request.POST.get('group_id', None)
    group_id = request.GET.get('group_id', None) if group_id is None else group_id

    if group_id is None:
        return HttpResponseBadRequest("'group_id' parameter is not defined")
    try:
        grp = Group.objects.get(pk=group_id)
    except Exception as e:
        return HttpResponseBadRequest(e.message)

    return HttpResponse(json.dumps(list(grp.students.values())), mimetype='application/json')