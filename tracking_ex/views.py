import json

from django.contrib.auth.decorators import login_required
from django.http.response import HttpResponse
from django.shortcuts import render
from tracking.models import Visitor

from app.utils import json_dthandler, require_in_GET


@login_required
def stat(request):
    visitors = Visitor.objects.all().order_by("-start_time") \
        .values("ip_address", "user_agent", "start_time", "end_time", "time_on_site")
    context = {
        'visitors': visitors
    }
    return render(request, "tracking_ex/stat.html", context)


@login_required
@require_in_GET("page")
def visitors_list(request):
    items_per_page = 10
    i = max(1, int(request.GET['page']))

    ifrom = (i - 1) * items_per_page
    ito = i * items_per_page

    vstrs = list(Visitor.objects.all().order_by("-start_time")
                     .values("ip_address", "user_agent", "start_time", "end_time", "time_on_site")[ifrom: ito])

    return HttpResponse(json.dumps(
        {
            'visitors': vstrs,
            'no_more': len(vstrs) < items_per_page
        }, default=json_dthandler), content_type="json")