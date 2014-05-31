from django.shortcuts import render


def index(request):
    return render(request, "tealeaf_admin/base_page.html")