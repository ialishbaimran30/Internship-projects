from django.urls import path,include
from . import views

urlpatterns =[
    path("", views.home,name="home"),

    path("register/", views.register, name="register"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view,name="logout"),
    path("dashboard/",views.dashboard,name="dashboard"),
    path("notes/",include("notes.urls")),
    path("tasks/", include("tasks.urls")),
    path("notes/",include("notes.urls")),
]