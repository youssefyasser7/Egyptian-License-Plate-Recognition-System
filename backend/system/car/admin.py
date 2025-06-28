from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(Car)
admin.site.register(CarNo)
admin.site.register(Guest)
admin.site.register(BlackList)
admin.site.register(CarEntrance)
admin.site.register(CarExit)