import json
from django.contrib.auth.decorators import login_required
from django.forms.models import model_to_dict
from django.http.response import HttpResponse
from tastypie.resources import ModelResource
from app.utils import require_in_GET, update_object, require_in_POST, update_post_object, get_post_object
from ..models.labs import StudentLab, StudentTask
from ..models.discipline import Discipline

permitted_keys = ['title', 'description', 'discipline_id']

@require_in_GET('discipline_id', 'group_id')
def index(request):
    discipline_id = request.GET['discipline_id']
    group_id = request.GET['group_id']

    data = StudentLab.objects.filter(discipline_id=discipline_id)
    data = list([model_to_dict(d) for d in data])
    for d in data:
        tasks = list([model_to_dict(t) for t in StudentTask.objects.filter(lab=d['id'])])
        d.update({
            'tasks': tasks
        })

    if not request.user.is_authenticated():
        data = filter(lambda x: len(x['tasks']) > 0, data)

    return HttpResponse(json.dumps({
        'labs': data,
        'complex_choices': dict(StudentTask.COMPLEX_CHOICES)
    }), content_type='json')


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
    update_post_object(request, StudentLab, *permitted_keys)
    return HttpResponse()

@login_required
@require_in_POST('order_array', 'id')
def lab_save_order(request):
    discipline = get_post_object(request, Discipline)
    order_array = json.loads(request.POST['order_array'])
    order_array = list([int(i) for i in  order_array])
    discipline.set_studentlab_order(order_array)
    return HttpResponse()