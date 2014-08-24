# coding=utf-8
import json

from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.db.transaction import atomic
from django.forms.models import model_to_dict
from django.http import HttpResponse
from django.http.response import HttpResponseBadRequest
from django.views.decorators.http import require_POST, require_GET

from students.models import active_years, Group, Student
from students.utils import current_year


def blank(request):
    return HttpResponse()


# @login_required
def years(request):
    yrs = list([{'year': y} for y in active_years()])
    return HttpResponse(json.dumps(yrs), mimetype='application/json')


# @login_required
def groups(request):
    year = request.POST.get('year', None)
    year = request.GET.get('year', None) if year is None else year
    # year = int(year)
    # if year is None:
    # return HttpResponseBadRequest("'year' parameter is not defined")

    grps = Group.objects.all()

    if year:
        grps = grps.filter(year=year)
    # grps = list(grps.values())

    out = []
    for g in grps:
        g_dict = model_to_dict(g)
        g_dict.update({'has_ancestor': g.has_ancestor})
        out.append(g_dict)

    return HttpResponse(json.dumps(out), mimetype='application/json')


@atomic
def update_students_data(students_list):
    for s in students_list:
        if '_destroy' in s and s['id'] != -1:  # destroyed items
            Student.objects.filter(pk=s['id']).delete()
        if s['modified'] and s['id'] != -1:  # modifieded items
            student = Student.objects.filter(pk=s['id']).first()
            if student is not None:
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


@atomic
def update_groups(groups_list):
    for g in groups_list:
        if '_destroy' in g and g['id'] != -1:  # destroyed items
            Group.objects.filter(pk=g['id']).delete()
        elif 'modified' in g and g['modified'] and g['id'] != -1:  # modifieded items
            group = Group.objects.filter(pk=g['id']).first()
            if group is not None:
                group.year = g['year']
                group.title = g['title']
                group.save()
        elif g['id'] == -1:  # new items
            group = Group()
            group.year = g['year']
            group.title = g['title']
            group.save()


@require_POST
@login_required
def save_groups(request):
    try:
        grps = json.loads(request.POST['groups'])
    except Exception as e:
        return HttpResponseBadRequest(e.message)

    try:
        update_groups(grps)
    except BaseException as e:
        HttpResponseBadRequest(e.message)

    return HttpResponse()


@require_POST
@login_required
def copy_to_next_year(request):
    group_id = request.POST['group_id']
    g = Group.objects.filter(pk=group_id).first()
    if g is not None:
        g.copy_to_next_year()
    return HttpResponse()


# @login_required
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


@require_GET
# @login_required
def list_students(request):
    task_id = request.GET.get("task_id", None)

    # если передали task_id, то возвращаем список студентов
    if task_id is not None:
        # task = TaskEx.objects.get(pk=task_id).first()
        # students = task.users()
        # students = users_for_task(task_id) #Student.objects.filter(taskstudent__taskex_id=task_id)
        pass
        # иначе отфильтрованный результат
    else:
        f = request.GET.get("filter", None)
        if f is None:
            return HttpResponseBadRequest()
        students = Student.objects.filter(Q(second_name__icontains=f) | Q(name__icontains=f),
                                          group__year=current_year())[:10]
    students = list([{"id": i.pk, "text": "%s %s | %s" % (i.name, i.second_name, i.group.title)} for i in students])
    return HttpResponse(json.dumps(students), content_type="application/json")

