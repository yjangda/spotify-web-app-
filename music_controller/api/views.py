from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def main (request): #make request from server and you get a response 
    return HttpResponse("<h1>Hello<h1>")