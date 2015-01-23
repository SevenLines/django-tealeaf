import os
import json

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.contrib.auth.decorators import login_required
from django.http.response import HttpResponse, HttpResponseBadRequest
from PIL import Image
from app.utils import require_in_POST

from articles.models import ArticlePluginModel, UploadImageFileForm


@login_required
@require_in_POST('plugin_id')
def save(request):
    pk = request.POST["plugin_id"]
    article_plugin = ArticlePluginModel.objects.filter(pk=pk).first()

    if article_plugin is None:
        return HttpResponseBadRequest()

    if "raw" not in request.POST:
        return HttpResponseBadRequest()

    raw = request.POST["raw"]
    if article_plugin.raw != raw:
        article_plugin.raw = raw
        article_plugin.save()

    return HttpResponse()

