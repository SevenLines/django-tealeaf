import json

from django.contrib.auth.decorators import login_required
from django.forms.models import model_to_dict
from django.http.response import HttpResponse
from tastypie.http import HttpBadRequest

from app.utils import require_in_GET, update_object, require_in_POST, update_post_object, get_post_object
from ..models.labs import StudentLab, StudentTask
from ..models.discipline import Discipline
from ..models import Group
from ..models.labs import StudentTaskResult


permitted_keys = ['title', 'description', 'discipline_id', 'visible', 'columns_count', 'regular']


@require_in_GET('discipline_id')
def index(request):
    discipline_id = request.GET['discipline_id']

    labs = StudentLab.objects.filter(discipline_id=discipline_id)
    if not request.user.is_authenticated():
        labs = labs.filter(visible=True)

    labs = list([model_to_dict(l) for l in labs])
    for l in labs:
        marks = StudentTaskResult.objects.filter(task__lab=l['id'])
        marks = list([t.as_dict for t in marks])
        tasks = list([t.as_dict for t in StudentTask.objects.filter(lab=l['id']).order_by('complexity', '_order', 'id')])
        l.update({
            'tasks': tasks,
            'marks': marks
        })

    if not request.user.is_authenticated():
        labs = filter(lambda x: len(x['tasks']) > 0, labs)

    return HttpResponse(json.dumps({
        'labs': labs,
        'complex_choices': dict(StudentTask.COMPLEX_CHOICES)
    }), content_type='json')


@require_in_GET('discipline_id', 'group_id')
def progress_table(request):
    g = Group.objects.get(id=request.GET['group_id'])
    assert isinstance(g, Group)
    students = g.students
    labs = StudentLab.objects.filter()
    return HttpBadRequest()


@login_required
@require_in_POST('discipline_id')
def new(request):
    lab = StudentLab()
    update_object(request.POST, lab, *permitted_keys)
    lab.save()
    return HttpResponse(json.dumps(model_to_dict(lab)), content_type='json')


@require_in_GET('id')
def show(request):
    pass


@login_required
@require_in_POST('id')
def delete(request):
    lab = get_post_object(request, StudentLab)
    lab.delete()
    return HttpResponse()


@login_required
@require_in_POST('id')
def save(request):
    lab = get_post_object(request, StudentLab)

    order_array = json.loads(request.POST['order_array'])
    order_array = list([int(i) for i in order_array])

    lab.set_studenttask_order(order_array)
    update_object(request.POST, lab, *permitted_keys)
    lab.save()
    return HttpResponse()


@login_required
@require_in_POST('marks')
def save_task_marks(request):
    marks = json.loads(request.POST['marks'])

    for m in marks:
        tr = StudentTaskResult.objects.filter(student=m['student'], task=m['task']).first()
        if not m['done']:
            if tr:
                tr.delete()
        else:
            if tr is None:
                tr = StudentTaskResult()
                tr.student_id = m['student']
                tr.task_id = m['task']

            tr.done = m['done']
            tr.save()

    return HttpResponse()


@login_required
@require_in_POST('order_array', 'id')
def lab_save_order(request):
    discipline = get_post_object(request, Discipline)
    order_array = json.loads(request.POST['order_array'])
    order_array = list([int(i) for i in order_array])
    discipline.set_studentlab_order(order_array)
    return HttpResponse()