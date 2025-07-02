from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view,permission_classes,authentication_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework import status
from django.contrib.auth.models import User, Group, Permission
from django.utils import timezone

# from django.db.models import Avg

from .models import *
from .serializers import *

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_cars(request):
    # filterset = Car(request.GET , queryset = cars.order_by('id'))
    # count = filterset.qs.count()
    # resPage = 2
    # paginator = PageNumberPagination()
    # paginator.page_size = resPage 
    
    # query_set = paginator.paginate_queryset(cars, request)
    if not request.user.groups.filter(name='admin').exists():
        if not request.user.groups.filter(name='security').exists():
            return Response({"Error" : "wrong user" }) 
        
    cars = Car.objects.all()
    carNoList = []
    for car in cars:
        carNoID = car.carNo.id
        carNo = get_object_or_404(CarNo , id = carNoID)
        carFullNo = []
        carFullNo.append(carNo.firstLetter)
        carFullNo.append(carNo.secondLetter)
        carFullNo.append(carNo.thirdLetter)
        carFullNo.append(carNo.firstNo)
        carFullNo.append(carNo.secondNo)
        carFullNo.append(carNo.thirdNo)
        carFullNo.append(carNo.fourthNo)
        carNoList.append(carFullNo)
        
        
    serializer = CarSerializer(cars ,many=True)
 
    for item,carNo in zip(serializer.data,carNoList):
        item['fullNo'] = carNo

    return Response({"Cars" : serializer.data }) 





@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_car(request,id):
    car = get_object_or_404(CarNo , id = id)
    print(f"car: {car}")
    carNoID = car.carNo.id
    print(f"carNO: {carNoID}")
    carNo = get_object_or_404(CarNo , id = carNoID)
    carSerializer = CarSerializer(car, many=False)
    carNoSerializer = CarNoSerializer(carNo, many=False)
    return Response({"car":carSerializer,"carNo":carNoSerializer})





@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_car(request):
    if not request.user.groups.filter(name='admin').exists():
        return Response({"Error":"User Restriction."})
    data = request.data
    carData = data['car']
    carNoData = data['carNo']
    print(f"car : {carData}")
    print(f"carNo : {carNoData}")
    carNoSerializer = CarNoSerializer(data = carNoData,many = False) 
    
    existingCar = CarNo.objects.filter(
        firstNo=carNoData['firstNo'],
        secondNo=carNoData['secondNo'],
        thirdNo=carNoData['thirdNo'],
        fourthNo=carNoData.get('fourthNo'),
        firstLetter=carNoData['firstLetter'],
        secondLetter=carNoData['secondLetter'],
        thirdLetter=carNoData.get('thirdLetter'),
        
        )
    if existingCar.exists():
        return Response({"Invalid data":"Car already exists"})
    
    if carNoSerializer.is_valid():
        carNo = CarNo.objects.create(**carNoData)
        noRes = CarNoSerializer(carNo )
        carNoID = noRes['id']
        # return Response({"Product" : res.data }) 
    
        carSerializer = CarSerializer(data = carData) 
        if carSerializer.is_valid():
            carData['carNo'] = carNo
            carData['createdBy'] = request.user
            car = Car.objects.create(**carData)
            res = CarSerializer(car)
            
            return Response({"car" : res.data , "carNo" : noRes.data}) 
        return Response({"Error" :"wrong car credentials"}) 
    return Response({"Error" :"wrong carNo credentials"}) 



@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_car(request):
    if not request.user.groups.filter(name='admin').exists():
        return Response({"Error":"User Restriction."})

    carID = request.data['id']
    car = get_object_or_404(Car,id=carID)
    carNo = get_object_or_404(CarNo,id=car.carNo.id)
    car.delete()
    carNo.delete()
    return Response({"done":"delete done successfuly"})


#User Manipulation

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_user(request):
    if not request.user.groups.filter(name='admin').exists():
        return Response({"Error":"User Restriction."})
    data = request.data
    user = User.objects.create_user(username=data['username'], password=data['password'])
    user.first_name = data['first_name']
    user.last_name = data['last_name']
    user.email = data['email']
    user.groups.add(data['group'])
    user.save()
    
    return Response({"Details" : "User is created successfully."})



@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request):
    if not request.user.groups.filter(name='admin').exists():
        return Response({"Error":"User Restriction."})
    username = request.data['username']
    user = get_object_or_404(User,username=username)
    user.delete()

    
    return Response({"Details" : "User is deleted successfully."})

#guests
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_guest(request):
    data = request.data
    user = request.user
    carData = data['car']
    carNoData = data['carNo']
    print(f"car : {carData}")
    print(f"carNo : {carNoData}")
    carNoSerializer = CarNoSerializer(data = carNoData,many = False) 
    
    existingCar = CarNo.objects.filter(
        firstNo=carNoData['firstNo'],
        secondNo=carNoData['secondNo'],
        thirdNo=carNoData['thirdNo'],
        fourthNo=carNoData.get('fourthNo'),
        
        firstLetter=carNoData['firstLetter'],
        secondLetter=carNoData['secondLetter'],
        thirdLetter=carNoData.get('thirdLetter'),
        
        )
    if existingCar.exists():
        return Response({"Invalid data":"Car already exists"})
    
    if carNoSerializer.is_valid():
        carNo = CarNo.objects.create(**carNoData)
        noRes = CarNoSerializer(carNo )
        carNoID = noRes['id']
        # return Response({"Product" : res.data }) 
    
        carSerializer = CarSerializer(data = carData) 
        if carSerializer.is_valid():
            carData['carNo'] = carNo
            carData['createdBy'] = request.user
            car = Car.objects.create(**carData)
            
            
            
    guest = Guest.objects.create(hostID=user,carID=car)
    guest.save()
    return Response({'Details' : "Guest added successfully"})



#BLACKLIST

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_blacklist(request):
    data = request.data
    user = request.user
    # car = Car.objects.filter(id = data['car'])
    car = Car.objects.get(id=data['car'])
    data['car'] = car
    if not user.groups.filter(name='admin').exists():
        return Response({"Error":"User Restriction."})
    blackList = BlackList.objects.create(**data)
    blackListSerializer = BlackListSerializer(blackList)
    
    print(blackListSerializer.data)
    return Response({"Details": blackListSerializer.data}, status=201)    





@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_blacklist(request):
    data = request.data
    user = request.user
    car = Car.objects.get(id = data['car'])
    data['car'] = car
    if not user.groups.filter(name='admin').exists():
        return Response({"Error":"User Restriction."})
    blackList = get_object_or_404(BlackList, car = data['car'], user= data["user"])
    blackList.delete()
    return Response({"done" : "delete done successfully"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def car_enter(request):
    data = request.data
    user = request.user
    
    if not user.groups.filter(name = 'admin') or user.groups.filter(name = 'security'):
        return Response({"error" : "User Restriction."})
    carNo = CarNo.objects.get(
        firstNo=data['firstNo'],
        secondNo=data['secondNo'],
        thirdNo=data['thirdNo'],
        fourthNo=data.get('fourthNo'),
        
        firstLetter=data['firstLetter'],
        secondLetter=data['secondLetter'],
        thirdLetter=data.get('thirdLetter'),
        
        )
    if carNo:
        car = Car.objects.get(carNo = carNo)
        blackList = BlackList.objects.filter(car = car)
        if blackList:
            return Response({"error" : "Car is in Blacklist."})
        carEntrance = CarEntrance.objects.create(car = car,security  = user)
        carEntrance.entranceTime = timezone.now()
        carEntrance.save()
        carEntranceSerializer = CarEntranceSerializer(carEntrance)
        return Response({"Details" : carEntranceSerializer.data})
    return Response({"Error" : "Car not found"})




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def car_exit(request):
    data = request.data
    user = request.user
    
    if not user.groups.filter(name = 'admin') or user.groups.filter(name = 'security'):
        return Response({"error" : "User Restriction."})
    carNo = CarNo.objects.get(
        firstNo=data['firstNo'],
        secondNo=data['secondNo'],
        thirdNo=data['thirdNo'],
        fourthNo=data.get('fourthNo'),
        
        firstLetter=data['firstLetter'],
        secondLetter=data['secondLetter'],
        thirdLetter=data.get('thirdLetter'),
        
        )
    if carNo:
        car = Car.objects.get(carNo = carNo)
        carExit = CarExit.objects.create(car = car,security  = user)
        carExit.exitTime = timezone.now()
        carExit.save()
        carExitSerializer = CarExitSerializer(carExit) 
        return Response({"Details" : carExitSerializer.data})
    return Response({"Error" : "Car not found"})