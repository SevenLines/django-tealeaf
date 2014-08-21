import json

from django.contrib.auth.decorators import login_required
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.core.exceptions import ObjectDoesNotExist
from django.forms.models import model_to_dict
from django.http.response import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render
from django.template.loader import render_to_string
from django.views.decorators.http import require_POST

from main_page.models import MainPageItem, MainPage


def require_item_id_in_POST(func):
    def wrapper(request):
        if "item_id" not in request.POST:
            return HttpResponseBadRequest("'item_id' param is not set")
        return func(request)

    return wrapper


def index(request):
    context = {
        'item': MainPage.solo().current_item
    }
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
        'item': model_to_dict(i),
        'html': render_to_string('main_page/image.html', {
            'item': model_to_dict(i),
        }),
    }), content_type='json')


def list_items(request):
    main_page = MainPage.solo()
    main_item = main_page.current_item

    items = []
    items.extend(list(MainPageItem.objects.all().order_by("-pk")[:4]))
    if main_item is not None and main_item not in items:
        items.append(main_item)

    output = []
    for i in items:
        i_dict = model_to_dict(i)
        i_dict.update({'active': main_item.id == i.id if main_item else False })
        output.append(i_dict)

    return HttpResponse(json.dumps(output), content_type='json')


@require_POST
@login_required
@require_item_id_in_POST
def set_active(request):
    item_id = request.POST['item_id']

    try:
        item = MainPageItem.objects.get(pk=item_id)
    except BaseException as e:
        return HttpResponseBadRequest(e.message)

    main_page_settings = MainPage.solo()
    main_page_settings.current_item = item
    main_page_settings.save()

    return render(request, 'main_page/image.html', {
        'item': MainPage.solo().current_item
    })


@login_required
@require_POST
@require_item_id_in_POST
def save_item(request):
    item_id = request.POST['item_id']
    i = MainPageItem.objects.get(pk=item_id)

    if 'description' in request.POST:
        i.description = request.POST['description']

    if 'title' in request.POST:
        i.title = request.POST['title']

    if 'item_url' in request.POST:
        i.item_url = request.POST['item_url']

    i.save()

    return item(request)


@login_required
@require_POST
def add_item(request):
    it = MainPageItem()
    it.title = request.POST['title']
    it.description = request.POST['description']

    f = request.FILES['file']
    path = "main_page/%s" % f.name

    if not default_storage.exists(path):
        path = default_storage.save(path, ContentFile(f.read()))

    it.local_path = path
    it.item_url = default_storage.url(path)
    it.save()

    mutable = request.POST._mutable
    request.POST._mutable = True
    request.POST['item_id'] = it.pk
    request.POST._mutable = mutable

    return item(request)


@login_required
@require_item_id_in_POST
def remove_item(request):
    item_id = request.POST['item_id']
    it = MainPageItem.objects.get(pk=item_id)
    try:
        default_storage.delete(it.local_path)
    except Exception as e:
        pass

    it.delete()

    return HttpResponse()
