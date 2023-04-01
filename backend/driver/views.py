from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ResultSerializer, RaceSerializer, StandingsSerializer
from .models import Result, Race

class ResultView(viewsets.ModelViewSet):
    serializer_class = ResultSerializer
    queryset = Result.objects.all()

    def get_queryset(self):
        race_name = self.request.query_params.get('race_name')
        year = self.request.query_params.get('year')
        if race_name and year:
            return self.queryset.filter(race__race_name=race_name, race__season=year)
        elif race_name:
            return self.queryset.filter(race__race_name=race_name)
        elif year:
            return self.queryset.filter(race__season=year)
        return self.queryset

class RaceView(viewsets.ModelViewSet):
    serializer_class = RaceSerializer
    queryset = Race.objects.all()


class StandingsView(viewsets.ModelViewSet):
    serializer_class = StandingsSerializer
    queryset = Result.objects.all()
    
    def get_queryset(self):
        year = self.request.query_params.get('year')
        if year:
            return self.queryset.filter(race__season=year)
        return self.queryset
