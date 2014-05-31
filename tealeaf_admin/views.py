from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required(login_url="login/")
def index(request):
    return render(request, "tealeaf_admin/base_page.html")


def login(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            print form
    else:
        form = AuthenticationForm(request)
    request.form = form
    return render(request, "tealeaf_admin/login.html")