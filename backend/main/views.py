from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.
def index(request):
    return render(request, "main/index.html")


@login_required
def backoffice(request):
    return render(request, "main/backoffice.html")