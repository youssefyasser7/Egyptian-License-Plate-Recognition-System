from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User,Group
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.views import TokenObtainPairView
from .custom_token import CustomTokenObtainPairSerializer  # زيادة على مجدى
from rest_framework.authtoken.models import Token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
from .models import Profile
from .serializers import RegisterSerializer, ChangePasswordSerializer, ProfileSerializer
from car.models import Car,CarNo

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_user(request):
    if not request.user.groups.filter(name='admin').exists():
        return Response({"Error":"User Restriction."})
    # user = 
    data = request.data['user']
    serializer = RegisterSerializer(data=data)
    if serializer.is_valid():
        group = Group.objects.get(name=data['type'])
        user = serializer.save()
        # user = serializer.create()
        user.save()
        carNoData = request.data['carNo']
        user.groups.add(group)
        existingCarNo = CarNo.objects.filter(
            firstNo=carNoData['firstNo'],
            secondNo=carNoData['secondNo'],
            thirdNo=carNoData['thirdNo'],
            fourthNo=carNoData['fourthNo'],
        
            firstLetter=carNoData['firstLetter'],
            secondLetter=carNoData['secondLetter'],
            thirdLetter=carNoData['thirdLetter'],
        
            ).first()
        car = None
        if existingCarNo:
            car = Car.objects.get( carNo = existingCarNo )

        profile = Profile.objects.create(
            user = user,
            name = data['username'],
            age = data['age'],
            type = data['type'],
            
            
            # img = data['img'],
            car = car,
            
        )
        
        profile.save()
        
        login(request, user)
        return Response({'message': 'User registered and logged in successfully.','userType' : profile.type}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    data = request.data
    username = data['username']
    password = data['password']
    user = authenticate(request, username=username, password=password)
    
    if user:
        profile = Profile.objects.get(user=user)
        login(request, user)
        return Response({'message': f'Welcome {user.username}!','userType':profile.type}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    if not request.user.groups.filter(name='admin').exists():
        return Response({"Error":"User Restriction."})
    
    data = request.data
    user = User.objects.filter(username = data['username']).first()
    request.user = user
    print(user)
    print("---------------------")
    print(request.user)
    serializer = ChangePasswordSerializer(data=data, context={'request': request})
    if serializer.is_valid():
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        login(request, request.user)
        return Response({'message': 'Password updated successfully.'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    profile = Profile.objects.get(user=request.user)
    print("test",profile)
    if request.method == 'GET':
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Profile updated successfully','type' : profile.type}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request):
    logout(request)
    return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
