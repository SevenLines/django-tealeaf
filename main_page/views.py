import json
from uuid import uuid4

from django.contrib.auth.decorators import login_required
from django.core.files.base import ContentFile
from django.core.exceptions import ObjectDoesNotExist
from django.http.response import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render
from django.template.context import RequestContext
from django.template.loader import render_to_string
from django.views.decorators.http import require_POST

from app.utils import require_in_POST
from main_page.models import MainPageItem, MainPage


def index(request):
    context = RequestContext(request, {
        'item': MainPage.solo().current_item.dictionary if MainPage.solo().current_item else None
    })
    return render(request, 'main_page/index.html', context)


@login_required
def item(request):
    try:
        if 'item_id' in request.POST:
            i = MainPageItem.objects.get(pk=request.POST['item_id'])
        elif 'item_id' in request.GET:
            i = MainPageItem.objects.get(pk=request.GET['item_id'])
        else:
            i = MainPage.solo().current_item
    except ObjectDoesNotExist as e:
        return HttpResponseBadRequest("can't get item with the item_id")

    return HttpResponse(json.dumps({
        'item': i.dictionary if i else None,
        'html': render_to_string('main_page/image.html', RequestContext(request, {
            'item': i.dictionary if i else None,
        })),
    }), content_type='json')


def list_items(request):
    main_page = MainPage.solo()
    main_item = main_page.current_item

    items = []
    items.extend(list(MainPageItem.objects.all().order_by("-pk")[:6]))
    if main_item is not None and main_item not in items:
        items.append(main_item)

    output = []
    for i in items:
        i_dict = i.dictionary
        i_dict.update({'active': main_item.id == i.id if main_item else False})
        output.append(i_dict)

    return HttpResponse(json.dumps(output), content_type='json')


@require_POST
@login_required
@require_in_POST("item_id")
def set_active(request):
    item_id = request.POST['item_id']

    try:
        item = MainPageItem.objects.get(pk=item_id)
    except BaseException as e:
        return HttpResponseBadRequest(e.message)

    main_page_settings = MainPage.solo()
    main_page_settings.current_item = item if item != main_page_settings.current_item else None
    main_page_settings.save()

    return render(request, 'main_page/image.html', {
        'item': MainPage.solo().current_item.dictionary if MainPage.solo().current_item else None
    })


@login_required
@require_POST
@require_in_POST("item_id")
def save_item(request):
    item_id = request.POST['item_id']
    i = MainPageItem.objects.get(pk=item_id)

    if 'description' in request.POST:
        i.description = request.POST['description']

    if 'title' in request.POST:
        i.title = request.POST['title']

    # if 'item_url' in request.POST:
    # i.item_url = request.POST['item_url']

    i.save()

    return item(request)


@login_required
@require_POST
@require_in_POST("title", "description")
def add_item(request):
    it = MainPageItem()
    it.title = request.POST['title']
    it.description = request.POST['description']

    f = request.FILES['file']
    ext = f.name.split('.')[-1]
    it.img.save('%s.%s' % (uuid4(), ext), ContentFile(f.read()))
    it.save()

    if "activate" in request.POST:
        main_page = MainPage.solo()
        main_page.current_item = it
        main_page.save()

    mutable = request.POST._mutable
    request.POST._mutable = True
    request.POST['item_id'] = it.pk
    request.POST._mutable = mutable

    return item(request)


@login_required
@require_in_POST("item_id")
def remove_item(request):
    item_id = request.POST['item_id']
    it = MainPageItem.objects.get(pk=item_id)
    it.delete()

    return HttpResponse()
