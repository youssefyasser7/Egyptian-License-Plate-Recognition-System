from django.urls import path,include


from . import views
# from .views import *

urlpatterns = [
    path('cars/', views.get_all_cars , name="get_all_cars"),
    path('car/<int:id>/', views.get_car , name="get_car"),
    path('cars/create/', views.create_car , name="create_car"),
    path('cars/delete/', views.delete_car , name="delete_car"),

    path('user/add/', views.add_user , name="add_user"),
    path('user/delete/', views.delete_user , name="delete_user"),
    
    
    path('guest/add/', views.add_guest , name="add_guest"),
    
    
    path('blacklist/add/', views.add_blacklist , name="add_blacklist"),
    path('blacklist/delete/', views.delete_blacklist , name="delete_blacklist"),


    path('carEntrance/', views.car_enter , name="car_enter"),
    path('carExit/', views.car_exit , name="car_exit"),


]
