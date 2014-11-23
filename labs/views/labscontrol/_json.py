import json
from django.http.response import HttpResponse
from labs.models import Lab, Task


def labs(request):
    labs_list = None
    if "lab_id" in request.GET:
        lab = Lab.objects.get(pk=int(request.GET['lab_id']))
        labs_list = [lab.to_dict(True)]
    elif "discipline_id" in request.GET:
        labs_list = Lab.all_to_dict(int(request.GET['discipline_id']), True)

    context = {
        'labs': labs_list if labs_list else [],
        'complex_choices': Task.COMPLEX_CHOICES,
    }
    return HttpResponse(json.dumps(context), content_type="json")
