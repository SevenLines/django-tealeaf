# coding=utf-8
import json

from django.contrib.auth.decorators import login_required
from django.db.models.aggregates import Sum, Min, Max, Count
from django.db import connection
from django.http.response import HttpResponse
from django.shortcuts import render
from tracking.models import Visitor

from app.utils import json_dthandler, require_in_GET, dictfetchall


@login_required
def stat(request):
    visitors = Visitor.objects.all().order_by("-start_time") \
        .values("ip_address", "user_agent", "start_time", "end_time", "time_on_site")
    context = {
        'title': 'Посетители',
        'visitors': visitors
    }
    return render(request, "tracking_ex/stat.html", context)


@login_required
@require_in_GET("page")
def visitors_list(request):
    items_per_page = 10
    i = max(1, int(request.GET['page']))

    offset = (i - 1) * items_per_page

    cursor = connection.cursor()
    cursor.execute('''
SELECT ip_address
  , user_agent
  , min(start_time) as start_time
  , max(end_time) as end_time
  , count(session_key) as visits
FROM tracking_visitor
  GROUP BY ip_address, user_agent, start_time::date
ORDER BY start_time DESC
LIMIT %(items_per_page)s
OFFSET %(offset)s
    ''', {
        'items_per_page': items_per_page,
        'offset': offset
    })

    vstrs = dictfetchall(cursor)

    return HttpResponse(json.dumps(
        {
            'visitors': vstrs,
            'no_more': len(vstrs) < items_per_page
        }, default=json_dthandler), content_type="json")