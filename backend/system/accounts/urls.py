from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomTokenObtainPairView  # زيادة

from .views import *

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('change_password/', change_password, name='change_password'),
    # path('profile/<int:pk>/', user_profile, name='profile'),
    path('profile/', user_profile, name='profile'),

    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
