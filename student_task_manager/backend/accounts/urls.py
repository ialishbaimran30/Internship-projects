from django.urls import path,include
from . import views
from accounts.views import RegisterAPIView
urlpatterns =[
    path("", views.home,name="home"),

    # path("register/", views.register, name="register"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view,name="logout"),
    path("dashboard/",views.dashboard,name="dashboard"),
    path("tasks/", include("tasks.urls")),
    path("register/", RegisterAPIView.as_view(), name="register"),
    
]