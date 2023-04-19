from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ResultSerializer, RaceSerializer, StandingsSerializer, DriverSerializer, ScheduleSerializer, ConstructorSerializer
from .models import Result, Race, Driver, RaceSchedule, Constructor
from django.http import JsonResponse
import base64
from django.views.decorators.csrf import csrf_exempt

import fastf1 as ff1
import matplotlib
matplotlib.use('Agg')

from .analysis import gear_shift, lap, speed

class ResultView(viewsets.ModelViewSet):
    serializer_class = ResultSerializer
    queryset = Result.objects.all()

    def get_queryset(self):
        race_name = self.request.query_params.get('race')
        year = self.request.query_params.get('year')
        driver = self.request.query_params.get('driver')
        constructor = self.request.query_params.get('constructor')
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
        elif constructor:
            queryset = self.queryset.filter(constructor=constructor)
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

class ConstructorView(viewsets.ModelViewSet):
    serializer_class = ConstructorSerializer
    queryset = Constructor.objects.all()

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


@csrf_exempt
def get_plot2(request):
    year = int(request.GET.get('year', 2021))
    race = request.GET.get('race', 'Spanish Grand Prix')
    race_session = request.GET.get('race_session', 'Q')

    driver1 = request.GET.get('driver1', 'HAM')
    driver2 = request.GET.get('driver2', 'VER')
    # colormap = plt.cm.plasma

    session = ff1.get_session(year, race, race_session)
    weekend = session.event
    session.load()

    buf = speed(session, driver1, year, weekend)
    buf2 = speed(session, driver2, year, weekend)

    buf3 = gear_shift(session, driver1)
    buf4 = gear_shift(session, driver2)

    x = lap(session, driver1)
    y = lap(session, driver2)

    data = {
        'plot1': base64.b64encode(buf.getvalue()).decode('utf-8'),
        'plot2': {
            'line1': x,
            'line2': y,
        },
        'plot3': base64.b64encode(buf2.getvalue()).decode('utf-8'),
        'plot4': base64.b64encode(buf3.getvalue()).decode('utf-8'),
        'plot5': base64.b64encode(buf4.getvalue()).decode('utf-8'),
    }


    return JsonResponse(data, safe=False)

