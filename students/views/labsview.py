from django.contrib.auth.decorators import login_required
from tastypie.resources import ModelResource
from app.utils import require_in_GET
from labs.models import LabEx


class LabsResource(ModelResource):
    class Meta:
        queryset = LabEx.objects.all()
        resourcename = 'lab'


@require_in_GET('discipline_id, group_id')
def index(request):
    pass


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