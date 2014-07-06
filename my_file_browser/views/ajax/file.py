import json
import os
from PIL import Image
from django.contrib.auth.decorators import login_required
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.http.response import HttpResponseBadRequest, HttpResponse

@login_required
def upload(request):
    try:
        if request.method == 'POST':
            f = request.FILES['data']
            pth = request.POST['path']
            path = "file_browser/%s/%s" % (pth, f.name)
            if not default_storage.exists(path):
                path = default_storage.save(path, ContentFile(f.read()))

            url = default_storage.url(path)
            # type of file
            link_type = "link"
            try:
                # checking for image
                im = Image.open(default_storage.open(path))
                im.verify()
                link_type = "image"
            except:
                pass

            r = {
                'url': url,
                'type': link_type,
                'filename': os.path.splitext(os.path.basename(url))[0],
            }
            return HttpResponse(json.dumps(r), content_type="application/json")
    except BaseException as e:
        print e
    return HttpResponseBadRequest()
