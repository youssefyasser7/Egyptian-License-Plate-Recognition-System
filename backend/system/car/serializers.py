from rest_framework import serializers
from .models import *


class CarNoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarNo
        fields = '__all__'
        
        
class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = '__all__'

class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = '__all__'
        
        
class BlackListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlackList
        fields = '__all__'
        
        

class CarEntranceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarEntrance
        fields = '__all__'
        
        
        
class CarExitSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarExit
        fields = '__all__'
        
        
        

