from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save
# Create your models here.

class CarNo(models.Model):
    firstLetter = models.CharField(max_length=1,blank=False )
    secondLetter = models.CharField(max_length=1,blank=False )
    thirdLetter = models.CharField(max_length=1,blank=True,null=True )
    
    firstNo = models.CharField(max_length=1, blank=False)
    secondNo = models.CharField(max_length=1, blank=False)
    thirdNo = models.CharField(max_length=1, blank=False)
    fourthNo = models.CharField(max_length=1, blank=True,null=True)
    
    
    
    
class Car(models.Model):
    carType = models.CharField(max_length=400 , default='' , blank=False)
    carColor = models.CharField(max_length=400 , default='' , blank=False)
    carNo = models.ForeignKey(CarNo,on_delete=models.CASCADE, null=False,default='')
    userID = models.ForeignKey(User , null=True ,on_delete=models.SET_NULL , related_name='owns_cars' )
    
    createdBy = models.ForeignKey(User , null=True ,on_delete=models.SET_NULL , related_name='created_by')


class Guest(models.Model):
    hostID = models.ForeignKey(User , null=True ,on_delete=models.SET_NULL)
    carID = models.ForeignKey(Car , null=True ,on_delete=models.SET_NULL)




class CarEntrance(models.Model):
    entranceTime = models.DateTimeField(auto_now_add=True)
    car = models.ForeignKey(Car , null=True ,on_delete=models.SET_NULL)
    security = models.ForeignKey(User , null=True ,on_delete=models.SET_NULL)
    
    

class CarExit(models.Model):
    exitTime = models.DateTimeField(auto_now_add=True)
    car = models.ForeignKey(Car , null=True ,on_delete=models.SET_NULL)
    security = models.ForeignKey(User , null=True ,on_delete=models.SET_NULL)
    

class BlackList(models.Model):
    car = models.ForeignKey(Car , null=True ,on_delete=models.SET_NULL)
    user = models.ForeignKey(User , null=True ,on_delete=models.SET_NULL)
    reason = models.TextField(default='')
    