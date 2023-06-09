from rest_framework import serializers
from .models import Result, Race, Driver, RaceSchedule, Constructor

class RaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Race
        fields = '__all__'

class ResultSerializer(serializers.ModelSerializer):
    race = RaceSerializer(many=False)
    
    class Meta:
        model = Result
        fields = ('race', 'driver', 'constructor', 'grid', 'position', 'points', 'laps', 'status')


class StandingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ('driver', 'constructor', 'position', 'points', 'race')


class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RaceSchedule
        fields = '__all__'

class ConstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Constructor
        fields = '__all__'

    
    