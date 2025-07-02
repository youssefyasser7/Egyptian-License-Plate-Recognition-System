from django.contrib import admin
from django.urls import path,include

from .views import *
urlpatterns = [
    path('detect/', send_image,name='send_image' ),

]
