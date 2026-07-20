from django.shortcuts import render,redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from tasks.models import Task
from rest_framework import generics
from accounts.serializers import RegisterSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny

# Create your views here.
def home(request):
    return render (request, "accounts/home.html")
@csrf_exempt
def register(request):
    if request.method =="POST": 
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("home")
    else:
        form = UserCreationForm()
    return render(request,"accounts/register.html",{"form":form})

def login_view(request):
    if request.method =="POST":
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user= form.get_user()
            login(request,user)
            return redirect("dashboard")
    else:
        form = AuthenticationForm()
    return render(request,"accounts/login.html",{"form":form})

@login_required
def dashboard(request):
    total_tasks= Task.objects.filter(user = request.user).count()
    pending_tasks= Task.objects.filter(user = request.user,status ="Pending").count()
    complete_tasks =Task.objects.filter(user=request.user , status ="Completed").count()
    total_notes= Task.objects.filter(user=request.user).count()
    context={"total_tasks":total_tasks,"pending_tasks":pending_tasks,"completed_tasks":complete_tasks,"total_nptes":total_notes}
    return render(request,"accounts/dashboard.html",context)

def logout_view(request):
    logout(request)
    return redirect("home")

class RegisterAPIView(generics.CreateAPIView):
    serializer_class=RegisterSerializer
    permission_classes=[AllowAny]