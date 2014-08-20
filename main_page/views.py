import json

from django.http.response import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render


# Create your views here.
from django.views.decorators.http import require_POST
from main_page.models import MainPageItem, MainPage


def index(request):
    context = {
        'item': MainPage.objects.get().current_item
    }
    return render(request, 'main_page/index.html', context)


def list_items(request):
    return HttpResponse(json.dumps(list(MainPageItem.objects.all().values())), content_type='json')


@require_POST
def set_active(request):
    if "item_id" not in request.POST:
        return HttpResponseBadRequest("'item_id' param is not set")

    item_id = request.POST['item_id']

    try:
        item = MainPageItem.objects.get(pk=item_id)
    except BaseException as e:
        return HttpResponseBadRequest(e.message)

    main_page_settings = MainPage.objects.get()
    main_page_settings.current_item = item
    main_page_settings.save()

    return render(request, 'main_page/image.html', {
        'item': MainPage.objects.get().current_item
    })
