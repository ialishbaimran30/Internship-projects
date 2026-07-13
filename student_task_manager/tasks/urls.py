from django.urls import path,include
from . import views
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet
urlpatterns=[
    path("add/",views.add_task,name = "add_task"),
    path("",views.task_list,name="task_list"),
    path("edit/<int:id>/",views.edit_task, name= "edit_task"),
    path ("delete/<int:id>/",views.delete_task,name="delete_task"),
    path("api/", views.TaskViewSet.as_view({'get':'list','post': 'create','put': 'update','patch': 'partial_update','delete': 'destroy'}),)
    
]