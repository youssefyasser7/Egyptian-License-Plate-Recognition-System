from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


from car.models import Car
# Create your models here.
class UserType(models.TextChoices):
    admin = 'admin'
    security = 'security'
    carHolder = 'carHolder'

image_height = 300
image_width = 300
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.SET_NULL,related_name='user',null=True)
    name = models.CharField(max_length=200)
    age=models.IntegerField(default=0, blank=True)
    type = models.CharField(max_length=50 ,choices=UserType.choices)
    # type = models.CharField(max_length=50 )

    
    image_width = models.PositiveIntegerField(null=True, blank=True)
    image_height = models.PositiveIntegerField(null=True, blank=True)
    
    img = models.ImageField(upload_to='profile-image/', height_field="image_height",width_field="image_width", blank=True,null=True)
    bio = models.TextField(blank=True,null=True)
    car = models.ForeignKey(Car,null=True,blank=True,on_delete=models.DO_NOTHING,related_name='car')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name