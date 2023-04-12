from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ResultSerializer, RaceSerializer, StandingsSerializer, DriverSerializer, ScheduleSerializer
from .models import Result, Race, Driver, RaceSchedule

class ResultView(viewsets.ModelViewSet):
    serializer_class = ResultSerializer
    queryset = Result.objects.all()

    def get_queryset(self):
        race_name = self.request.query_params.get('race')
        year = self.request.query_params.get('year')
        driver = self.request.query_params.get('driver')
        start_year = self.request.query_params.get('start_year')
        end_year = self.request.query_params.get('end_year')

        if race_name and year:
            queryset = self.queryset.filter(race__race_name=race_name, race__season=year)
        elif race_name:
            queryset = self.queryset.filter(race__race_name=race_name)
        elif year:
            queryset = self.queryset.filter(race__season=year)
        elif driver:
            queryset = self.queryset.filter(driver=driver)
        else:
            queryset = self.queryset

        if start_year and end_year:
            queryset = queryset.filter(race__season__gte=start_year, race__season__lte=end_year)
        elif start_year:
            queryset = queryset.filter(race__season__gte=start_year)
        elif end_year:
            queryset = queryset.filter(race__season__lte=end_year)
        return queryset


class RaceView(viewsets.ModelViewSet):
    serializer_class = RaceSerializer
    queryset = Race.objects.all()

class DriverView(viewsets.ModelViewSet):
    serializer_class = DriverSerializer
    queryset = Driver.objects.all()

class ScheduleView(viewsets.ModelViewSet):
    serializer_class = ScheduleSerializer
    queryset = RaceSchedule.objects.all()


class StandingsView(viewsets.ModelViewSet):
    serializer_class = StandingsSerializer
    queryset = Result.objects.all()
    
    def get_queryset(self):
        year = self.request.query_params.get('year')
        if year:
            return self.queryset.filter(race__season=year)
        return self.queryset

