from rest_framework import serializers
from .models import Result, Driver, Race

# class TodoSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Todo
#         fields = ('id', 'title', 'description', 'completed')


class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ('driver_id', 'driver_code', 'driver_number', 'driver_name', 'nationality')

class RaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Race
        fields = '__all__'

class ResultSerializer(serializers.ModelSerializer):
    race = RaceSerializer(many=False)
    
    class Meta:
        model = Result
        fields = ('race', 'driver', 'constructor', 'grid', 'position', 'points', 'laps', 'status')

# testing race first
class ResultSerializerTest(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ('race', 'driver', 'constructor', 'grid', 'position', 'points', 'laps', 'status')

class RaceSerializerTest(serializers.ModelSerializer):
    result = ResultSerializerTest(many=True)
    class Meta:
        model = Race
        fields = '__all__'



# class RaceResultSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = RaceResult
#         fields = '__all__'

# class DriverSerializer(serializers.ModelSerializer):
#     race_results = RaceResultSerializer(many=True, read_only=True)
    
#     class Meta:
#         model = Driver
#         fields = ('id', 'driver_name', 'race_results')