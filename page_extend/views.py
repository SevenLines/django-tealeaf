from cms.middleware.page import get_page
from cms.models import Page
import django.utils.translation
from django.contrib.auth.decorators import login_required
from django.http.response import HttpResponseRedirect, HttpResponse


@login_required
def update_page(request):
    id = request.POST['page_id']
    page = Page.objects.get(pk=id)

    if 'image_id' in request.POST:
        page.pageextend.image_id = request.POST['image_id']
    else:
        page.pageextend.image_id = None

    page.pageextend.touchable = 'touchable' in request.POST
    page.pageextend.authentication_required = 'authentication_required' in request.POST

    page.pageextend.save()

    return HttpResponseRedirect(request.META['HTTP_REFERER'])

@login_required
def publish_page(request, page_id):
    page = Page.objects.get(pk=page_id)
    page.publish(django.utils.translation.get_language())

    return HttpResponseRedirect(request.META['HTTP_REFERER'])