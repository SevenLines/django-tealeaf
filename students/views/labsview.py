import json
from django.contrib.auth.decorators import login_required
from django.forms.models import model_to_dict
from django.http.response import HttpResponse
from tastypie.resources import ModelResource
from app.utils import require_in_GET
from labs.models import LabEx, Lab, Task


@require_in_GET('discipline_id', 'group_id')
def index(request):
    discipline_id = request.GET['discipline_id']
    group_id = request.GET['group_id']

    data = Lab.objects.filter(discipline_id=discipline_id)
    data = list([model_to_dict(d) for d in data])
    for d in data:
        tasks = list([model_to_dict(t) for t in Task.objects.filter(lab=d['id'])])
        d.update({
            'tasks': tasks
        })

    if not request.user.is_authenticated():
        data = filter(lambda x: len(x['tasks']) > 0, data)

    return HttpResponse(json.dumps({
        'labs': data,
        'complex_choices': dict(Task.COMPLEX_CHOICES,)
    }), content_type='json')


@login_required
def new(request):
    pass


@require_in_GET('id')
def show(request):
    pass


@login_required
@require_in_GET('id')
def delete(request):
    pass


@login_required
def save():
    pass