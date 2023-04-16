from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ResultSerializer, RaceSerializer, StandingsSerializer, DriverSerializer, ScheduleSerializer, ConstructorSerializer
from .models import Result, Race, Driver, RaceSchedule, Constructor

import matplotlib.pyplot as plt
# import fastf1.plotting
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import base64

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



# def get_plot(request):

        
#     year = int(request.GET.get('year', 2021))
#     race = request.GET.get('race', 'Spanish Grand Prix')
#     race_session = request.GET.get('race_session', 'Q')
#     driver = request.GET.get('driver1', 'HAM')
#     colormap = plt.cm.plasma

#     session = ff1.get_session(year, race, race_session)
#     weekend = session.event
#     session.load()
#     lap = session.laps.pick_driver(driver).pick_fastest()

#     # Get telemetry data
#     x = lap.telemetry['X']              # values for x-axis
#     y = lap.telemetry['Y']              
#     color = lap.telemetry['Speed']      

#     points = np.array([x, y]).T.reshape(-1, 1, 2)
#     segments = np.concatenate([points[:-1], points[1:]], axis=1)

#     fig, ax = plt.subplots(sharex=True, sharey=True, figsize=(12, 6.75))
#     fig.suptitle(f'{weekend.name} {year} - {driver} - Speed', size=24, y=0.97)

#     plt.subplots_adjust(left=0.1, right=0.9, top=0.9, bottom=0.12)
#     ax.axis('off')

#     ax.plot(lap.telemetry['X'], lap.telemetry['Y'], color='black', linestyle='-', linewidth=16, zorder=0)

#     norm = plt.Normalize(color.min(), color.max())
#     lc = LineCollection(segments, cmap=colormap, norm=norm, linestyle='-', linewidth=5)

#     lc.set_array(color)

#     line = ax.add_collection(lc)

#     cbaxes = fig.add_axes([0.25, 0.05, 0.5, 0.05])
#     normlegend = mpl.colors.Normalize(vmin=color.min(), vmax=color.max())
#     legend = mpl.colorbar.ColorbarBase(cbaxes, norm=normlegend, cmap=colormap, orientation="horizontal")

#     # Save the plot to a bytes buffer
#     buf = io.BytesIO()
#     fig.savefig(buf, format='png')
#     plt.close(fig)

#     # Return the bytes buffer as an HTTP response
#     response = HttpResponse(buf.getvalue(), content_type='image/png')
#     return response

# @csrf_exempt
# def get_plot2(request):
#     year = int(request.GET.get('year', 2021))
#     race = request.GET.get('race', 'Spanish Grand Prix')
#     race_session = request.GET.get('race_session', 'Q')
#     driver1 = request.GET.get('driver1', 'HAM')
#     driver2 = request.GET.get('driver2', 'VER')

#     session = ff1.get_session(year, race, race_session)
#     session.load()

#     lap1 = session.laps.pick_driver(driver2).pick_fastest()
#     lap2 = session.laps.pick_driver(driver1).pick_fastest()

#     tel1 = lap1.get_car_data().add_distance()
#     tel2 = lap2.get_car_data().add_distance()

#     all_distances = list(tel1['Distance']) + list(tel2['Distance'])
#     # print(all_distances)
#     all_distances.sort()

#     data = {
#         'line1': dict(zip(list(tel1['Distance']), list(tel1['Speed']))),
#         'line2': dict(zip(list(tel2['Distance']), list(tel2['Speed']))),
#     }

#     return JsonResponse(data)







def get_plot2(request):
    year = int(request.GET.get('year', 2021))
    race = request.GET.get('race', 'Spanish Grand Prix')
    race_session = request.GET.get('race_session', 'Q')

    driver1 = request.GET.get('driver1', 'HAM')
    driver2 = request.GET.get('driver2', 'VER')
    colormap = plt.cm.plasma

    session = ff1.get_session(year, race, race_session)
    weekend = session.event
    session.load()
    lap = session.laps.pick_driver(driver1).pick_fastest()

    x = lap.telemetry['X']
    y = lap.telemetry['Y']
    color = lap.telemetry['Speed']

    points = np.array([x, y]).T.reshape(-1, 1, 2)
    segments = np.concatenate([points[:-1], points[1:]], axis=1)

    fig, ax = plt.subplots(sharex=True, sharey=True, figsize=(12, 6.75))
    fig.suptitle(f'{weekend.name} {year} - {driver1} - Speed', size=24, y=0.97)

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

    lap1 = session.laps.pick_driver(driver1).pick_fastest()
    lap2 = session.laps.pick_driver(driver2).pick_fastest()

    tel1 = lap1.get_car_data().add_distance()
    tel2 = lap2.get_car_data().add_distance()

    all_distances = list(tel1['Distance']) + list(tel2['Distance'])
    all_distances.sort()

    data = {
        'plot1': base64.b64encode(buf.getvalue()).decode('utf-8'),
        'plot2': {
            'line1': dict(zip(list(tel1['Distance']), list(tel1['Speed']))),
            'line2': dict(zip(list(tel2['Distance']), list(tel2['Speed']))),
        }
    }

    return JsonResponse(data, safe=False)
