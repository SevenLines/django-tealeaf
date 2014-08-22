from django.shortcuts import render


def index(request):
    return render(request, "students/marks_editor.html")