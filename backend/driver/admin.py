from django.contrib import admin
from .models import Todo, Driver

# class TodoAdmin(admin.ModelAdmin):
#     list_display = ('title', 'description', 'completed')

class DriverAdmin(admin.ModelAdmin):
    list_display = ('driver_id', 'driver_code', 'driver_number', 'driver_name', 'nationality')

# Register your models here.

# admin.site.register(Todo, TodoAdmin)

admin.site.register(Driver, DriverAdmin)
