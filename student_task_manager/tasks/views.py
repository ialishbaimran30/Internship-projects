from django.shortcuts import render,redirect,get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Task,Category
from .forms import TaskForm
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import Taskserializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.routers import DefaultRouter
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
# Create your views here.
@login_required
def add_task(request):
    if  request.method == "POST":
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit= False)
            task.user = request.user
            task.save()
            form.save_m2m()
            return redirect("dashboard")
    else:
        form = TaskForm()
        return render(request,"tasks/add_task.html",{"form":form})
    
@login_required
def task_list(request):
     
    search=request.GET.get("search")
    status =request.GET.get("status")
    priority=request.GET.get("priority")
    category = request.GET.get("category")

    tasks= Task.objects.filter(user=request.user)
    if search:
        tasks=tasks.filter(title__icontains=search)
    if status:
        tasks=tasks.filter(status=status)
    if priority:
        tasks = tasks.filter(priority=priority)

    if category:
        tasks = tasks.filter(category_id=category)
    categories= Category.objects.all()
    return render(request,"tasks/task_list.html",{"tasks":tasks,"categories":categories})
    

@login_required
def edit_task(request,id):
    task =get_object_or_404(Task, id=id,user=request.user)
    if request.method== "POST":
        form = TaskForm(request.POST,instance =task)
        if form.is_valid():
            form.save()

            return redirect("task_list")
    
    else:
        form = TaskForm(instance=task)
    return render(request,"tasks/add_task.html",{"form":form})
@login_required
def delete_task(request,id):
    task =get_object_or_404(Task,id=id,user = request.user)
    task.delete()
    return redirect("task_list")

# class TaskListAPI(APIView):
#     def get(self,request):
#         tasks = Task.objects.all()
#         serializer = Taskserializer(tasks, many=True)
#         return Response(serializer.data)
    
#     def post(self,request):
#         serializer = Taskserializer(data=request.data)

#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status.HTTP_201_CREATED)
#         return Response(serializer.errors,status.HTTP_400_BAD_REQUEST)

# VIEWSETS
class TaskViewSet(ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = Taskserializer
    permission_classes=[IsAuthenticated]
    
    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)




