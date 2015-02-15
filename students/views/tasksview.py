import json

from django.contrib.auth.decorators import login_required
from django.forms.models import model_to_dict
from django.http.response import HttpResponse

from app.utils import require_in_POST, update_post_object, get_post_object, update_object
from ..models.labs import StudentTask


permitted_keys = ['description', 'complexity']


@login_required
@require_in_POST('id')
def save(request):
    update_post_object(request, StudentTask, *permitted_keys)
    return HttpResponse()


@require_in_POST('id')
def show(request):
    pass


@login_required
@require_in_POST('id')
def delete(request):
    task = get_post_object(request, StudentTask)
    task.delete()
    return HttpResponse()

def index(request):
    pass


@login_required
@require_in_POST('lab_id')
def new(request):
    task = StudentTask()
    task.lab_id = request.POST['lab_id']
    update_object(request.POST, task, *permitted_keys)
    task.save()
    return HttpResponse(json.dumps(model_to_dict(task)), content_type='json')