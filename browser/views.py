import os
from django.contrib.auth.decorators import login_required
from django.core.context_processors import media
from django.core.files.storage import default_storage
from django.shortcuts import render

# Create your views here.

@login_required
def index(request, path):

    dirs, files = default_storage.listdir(path)

    dirs = [{
        'path': os.path.join(path, d),
        'name': d,
    } for d in dirs]

    files = [{
        'name': f,
        'url': default_storage.url(os.path.join(path, f)),
        'path': default_storage.path(os.path.join(path, f)),
    } for f in files]

    return render(request, "browser/index.html", {
        'dirs': dirs,
        'files': files,
        'previous': os.path.dirname(path)
    })