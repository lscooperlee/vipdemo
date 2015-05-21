from django.shortcuts import render, render_to_response
import json
from vipdemo.mnist import mnist
from django.http import JsonResponse



# Create your views here.

def demo_home(request):
    return render_to_response("vipdemo/index.html",{})

def test_data(request):
    m=mnist().random_select(10)
    return JsonResponse(m,safe=False)
 
