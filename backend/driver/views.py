from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ResultSerializer, RaceSerializer, StandingsSerializer, DriverSerializer, ScheduleSerializer, ConstructorSerializer
from .models import Result, Race, Driver, RaceSchedule, Constructor


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

import fastf1 as ff1
import matplotlib
matplotlib.use('Agg')
# import matplotlib.pyplot as plt
import io
from django.http import HttpResponse
import numpy as np

import matplotlib as mpl

from matplotlib import pyplot as plt
from matplotlib.collections import LineCollection

def get_plot(request):
    year = 2023
    wknd = 3
    ses = 'R'
    driver = 'HAM'
    colormap = plt.cm.plasma

    session = ff1.get_session(year, wknd, ses)
    weekend = session.event
    session.load()
    lap = session.laps.pick_driver(driver).pick_fastest()

    # Get telemetry data
    x = lap.telemetry['X']              # values for x-axis
    y = lap.telemetry['Y']              
    color = lap.telemetry['Speed']      

    points = np.array([x, y]).T.reshape(-1, 1, 2)
    segments = np.concatenate([points[:-1], points[1:]], axis=1)

    fig, ax = plt.subplots(sharex=True, sharey=True, figsize=(12, 6.75))
    fig.suptitle(f'{weekend.name} {year} - {driver} - Speed', size=24, y=0.97)

    plt.subplots_adjust(left=0.1, right=0.9, top=0.9, bottom=0.12)
    ax.axis('off')

    ax.plot(lap.telemetry['X'], lap.telemetry['Y'], color='black', linestyle='-', linewidth=16, zorder=0)

    norm = plt.Normalize(color.min(), color.max())
    lc = LineCollection(segments, cmap=colormap, norm=norm, linestyle='-', linewidth=5)

    lc.set_array(color)

    line = ax.add_collection(lc)

    cbaxes = fig.add_axes([0.25, 0.05, 0.5, 0.05])
    normlegend = mpl.colors.Normalize(vmin=color.min(), vmax=color.max())
    legend = mpl.colorbar.ColorbarBase(cbaxes, norm=normlegend, cmap=colormap, orientation="horizontal")

    # Save the plot to a bytes buffer
    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    plt.close(fig)

    # Return the bytes buffer as an HTTP response
    response = HttpResponse(buf.getvalue(), content_type='image/png')
    return response



import matplotlib.pyplot as plt
import fastf1.plotting

def get_plot2(request):

    year = 2021
    race = "Spanish Grand Prix"
    race_session = "Q"

    driver1 = 'HAM'
    driver2 = 'VER'

    ff1.plotting.setup_mpl()

    session = ff1.get_session(year, race, race_session)
    session.load()

    lap1 = session.laps.pick_driver(driver2).pick_fastest()
    lap2 = session.laps.pick_driver(driver1).pick_fastest()

    tel1 = lap1.get_car_data().add_distance()
    tel2 = lap2.get_car_data().add_distance()

    fig, ax = plt.subplots()
    ax.plot(tel1['Distance'], tel1['Speed'], label=driver2)
    ax.plot(tel2['Distance'], tel2['Speed'], label=driver1)

    ax.set_xlabel('Distance in m')
    ax.set_ylabel('Speed in km/h')

    ax.legend()
    plt.suptitle(f"Fastest Lap Comparison \n "f"{session.event['EventName']} {session.event.year} Qualifying")

    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    plt.close(fig)

    # Return the bytes buffer as an HTTP response
    response = HttpResponse(buf.getvalue(), content_type='image/png')
    return response