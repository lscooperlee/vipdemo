from django.shortcuts import render, render_to_response

# Create your views here.

def demo_home(request):
    return render_to_response("index.html",{})
