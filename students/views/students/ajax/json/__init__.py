# coding=utf-8
import json
import os

from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.db.transaction import atomic
from django.forms.models import model_to_dict
from django.http import HttpResponse
from django.http.response import HttpResponseBadRequest
from django.utils.encoding import iri_to_uri
from django.views.decorators.http import require_POST, require_GET
from app.utils import require_in_POST, json_encoder, require_in_GET, add_cross_domain, update_object
from students.models.group import Group, active_years
from students.models.labs import StudentTaskResult
from students.models.lesson import Lesson
from students.models.student import Student, StudentFile
from students.utils import current_year

groups_permited_keys = ['title', 'ancestor', 'year', 'captain']

def blank(request):
    return HttpResponse()


def years(request):
    if request.user.is_authenticated():
        yrs = list([{'year': y} for y in active_years()])
    else:  # не аутентефицированным только текущий год
        yrs = [{'year': current_year()}]

    return HttpResponse(json.dumps(yrs), content_type='application/json')


def groups(request):
    year = request.GET.get('year', None)
    discipline_id = request.GET.get('discipline_id', -1)

    if not year or not year.isdigit():
        year = current_year()

    if not request.user.is_authenticated():
        grps = Group.objects.filter(
            Q(id__in=Lesson.objects.filter(discipline=discipline_id).values('group').distinct()) |
            Q(id__in=StudentTaskResult.objects.filter(task__lab__discipline=discipline_id).values(
                'student__group').distinct())
        )
    else:
        grps = Group.objects.all()

    if year:
        grps = grps.filter(year=year)

    out = []
    for g in grps:
        g_dict = model_to_dict(g)
        g_dict.update({'has_ancestor': g.has_ancestor})
        out.append(g_dict)

    r = HttpResponse(json.dumps(out), content_type='application/json')
    # r.cookies['year'] = year
    return r


@atomic
def update_students_data(students_list):
    new_students_index = {}
    for s in students_list:
        if '_destroy' in s and s['id'] > -1:  # destroyed items
            Student.objects.filter(pk=s['id']).delete()
        elif s['id'] > -1:  # modifieded items
            student = Student.objects.filter(pk=s['id']).first()
            for prop in ['group_id', 'name', 'second_name', 'phone', 'email', 'vk', 'sex']:
                if prop in s:
                    setattr(student, prop, s[prop])
            student.save()
        elif s['id'] <= -1 and 'group' in s:  # new items
            student = Student()
            student.group_id = int(s['group'])
            for prop in ['name', 'second_name', 'phone', 'email', 'vk', 'sex']:
                if prop in s:
                    setattr(student, prop, s[prop])
            id = s['id']
            student.save()
            new_students_index[id] = student.id
    return new_students_index


@require_POST
@login_required
@require_in_POST('students')
def save_students(request):
    students = json.loads(request.POST['students'])
    new_students_index = update_students_data(students)
    return HttpResponse(json.dumps(new_students_index), content_type='json')


@atomic
def update_groups(groups_list):
    new_groups_index = {}
    for g in groups_list:
        if '_destroy' in g and g['id'] > -1:  # destroyed items
            Group.objects.filter(pk=g['id']).delete()
        elif g['id'] > -1:  # modifieded items
            group = Group.objects.filter(pk=g['id']).first()
            if group is not None:
                if 'year' in g:
                    group.year = g['year']
                if 'title' in g:
                    group.title = g['title']
                if 'ancestor' in g:
                    group.ancestor_id = g['ancestor']
                if 'captain' in g:
                    group.captain_id = g['captain']
                group.save()
        elif g['id'] <= -1:  # new items
            old_id = g['id']
            group = Group()

            if 'year' in g:
                group.year = g['year']
            if 'title' in g:
                group.title = g['title']
            if 'ancestor' in g:
                group.ancestor_id = g['ancestor']
            if 'captain' in g:
                group.captain_id = g['captain']

            group.save()
            new_groups_index[old_id] = group.id
    return new_groups_index


@require_POST
@require_in_POST('groups')
@login_required
def save_groups(request):
    groups = json.loads(request.POST['groups'])
    new_groups_index = update_groups(groups)

    return HttpResponse(json.dumps(new_groups_index), content_type='json')


@require_POST
@require_in_POST('group_id')
@login_required
def copy_to_next_year(request):
    group_id = request.POST['group_id']
    g = Group.objects.filter(pk=group_id).first()
    if g is not None:
        g.copy_to_next_year()
    return HttpResponse()


@require_in_GET('group_id')
def students(request):
    group_id = request.GET['group_id']

    try:
        grp = Group.objects.get(pk=group_id)
    except Exception as e:
        return HttpResponseBadRequest(e.message)

    _students = list([s.to_dict(request.user.is_authenticated) for s in grp.students.all()])

    response = HttpResponse(json.dumps(_students, default=json_encoder), content_type='application/json')

    return response


@require_GET
def list_students(request):
    """
    возвращает первые 10 студентов для select2
    и фильтрует их по параметру filter
    для гостей возвращает только студентов текущего года
    :param request:
    :return:
    """
    f = request.GET.get("filter", None)
    if f is None:
        return HttpResponse('[]')

    year = request.GET.get('year', current_year()) if request.user.is_authenticated() else current_year()

    students = Student.objects.filter(Q(second_name__icontains=f) | Q(name__icontains=f),
                                      group__year=year)[:10]
    students = list([{"id": i.pk, "text": str(i)} for i in students])

    response = HttpResponse(json.dumps(students), content_type="application/json")
    add_cross_domain(response)
    return response


@login_required
@require_in_POST("group_id", "student_id")
def set_captain(request):
    group_id = request.POST['group_id']
    student_id = request.POST['student_id']

    s = Student.objects.get(pk=student_id)
    g = Group.objects.get(pk=group_id)

    if s.group != g:
        return HttpResponseBadRequest()

    g.captain_id = student_id
    g.save()

    return HttpResponse()


@login_required
@require_in_POST("student_id")
def change_photo(request):
    photo = request.FILES['photo']
    s = Student.objects.get(pk=request.POST['student_id'])
    ext = photo.name.split(os.path.extsep)[-1]
    filename = "%s_%s.%s" % (s.second_name, s.name, ext)
    s.photo.save(filename, photo)
    s.save()
    return HttpResponse(s.photo.url)


@login_required
@require_in_POST("student_id")
def remove_photo(request):
    s = Student.objects.get(pk=request.POST['student_id'])
    s.photo.delete()
    return HttpResponse()


@login_required
@require_in_POST("student_id")
def add_file(request):
    file = request.FILES['file']
    student_file = StudentFile()
    student_file.content_type = file.content_type
    student_file.title = file.name
    student_file.student_id = request.POST['student_id']
    student_file.blob = file.file.read()
    student_file.save()
    return HttpResponse(json.dumps(model_to_dict(student_file)), content_type='json')


@login_required
@require_in_GET("student_file_id")
def remove_file(request):
    StudentFile.objects.get(pk=request.GET['student_file_id']).delete()
    return HttpResponse()


@require_in_GET("student_file_id")
def get_student_file(request):
    file = StudentFile.objects.get(pk=request.GET['student_file_id'])
    response = HttpResponse(file.blob, content_type=file.content_type)
    response['Content-Disposition'] = u"attachment; filename*=\"utf8''%s\"" % iri_to_uri(file.title)
    return response

