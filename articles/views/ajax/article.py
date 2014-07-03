import os
import json

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.contrib.auth.decorators import login_required
from django.http.response import HttpResponse, HttpResponseBadRequest
from PIL import Image

from articles.models import ArticlePluginModel, UploadImageFileForm


@login_required
def save(request):
    if "plugin" not in request.POST:
        return HttpResponseBadRequest()

    pk = request.POST["plugin"]
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


@login_required
def upload_file(request):
    try:
        print request.POST
        if request.method == 'POST':
            form = UploadImageFileForm(request.POST, request.FILES)
            if form.is_valid():
                f = request.FILES['_file']
                path = default_storage.save("articles/plugin/%s/%s" % (request.POST['pk'], f.name), ContentFile(f.read()))
                url = default_storage.url(path)

                # type of file
                type = "link"
                try:
                    # checking for image
                    im = Image.open(default_storage.open(path))
                    im.verify()
                    type = "image"
                except:
                    pass

                r = {
                    'url': url,
                    'type': type,
                    'filename': os.path.splitext(os.path.basename(url))[0],
                }
                return HttpResponse(json.dumps(r), content_type="application/json")
    except BaseException as e:
        print e
    return HttpResponseBadRequest()

