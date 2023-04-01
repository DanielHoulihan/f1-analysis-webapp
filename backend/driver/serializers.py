from rest_framework import serializers
from .models import Result, Race

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