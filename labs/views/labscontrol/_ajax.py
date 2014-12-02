from django.contrib.auth.decorators import login_required
from django.http import HttpResponseBadRequest, HttpResponse
from app.utils import require_in_POST
from labs.models import Lab


@require_in_POST("pk")
@login_required
def update_lab(request):
    lab = Lab.objects.filter(pk=request.POST['pk']).first()
    if not lab:
        return HttpResponseBadRequest("Lab with pk=%s doesn't exist" % request.POST['pk'])

    assert isinstance(lab, Lab)

    if 'position' in request.POST and request.POST['position']:
        lab.to(int(request.POST['position']))

    if 'discipline_id' in request.POST:
        if lab.discipline_id != request.POST['discipline_id']:
            lab.discipline_id = int(request.POST['discipline_id'])
            if lab.discipline_id == -1:
                lab.discipline_id = None

    if 'group_id' in request.POST:
        if lab.group_id != request.POST['group_id']:
            lab.group_id = int(request.POST['group_id'])
            if lab.group_id == -1:
                lab.group_id = None

    if 'title' in request.POST:
        if lab.title != request.POST['title']:
            lab.title = request.POST['title']

    if 'description' in request.POST:
        if lab.description != request.POST['description']:
            lab.description = request.POST['description']

    lab.save()

    return HttpResponse()