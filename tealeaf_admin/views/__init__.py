from django.contrib.auth import authenticate
from django.contrib import auth
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect
from django.template import RequestContext

from students.models import Group


def index(request):
    c = RequestContext(request, {
        'groups': Group.objects.all(),
    })
    return render(request, "tealeaf_admin/admin.html", context_instance=c)


def logout(request):
    auth.logout(request)
    return redirect('tealeaf_admin.views.index')


def login(request):
    if request.method == 'POST':
        print request.POST
        user = authenticate(username=request.POST['username'],
                            password=request.POST['password'])
        # next = request.POST['next']
        print next
        if user is not None and user.is_active:
            auth.login(request, user)
            return redirect('tealeaf_admin.views.index')

    request.form = AuthenticationForm(request)
    return render(request, "tealeaf_admin/login.html")