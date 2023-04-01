from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from driver import views

router = routers.DefaultRouter()
router.register(r'results', views.ResultView, 'result')
router.register(r'races', views.RaceView, 'race')
router.register(r'standings', views.StandingsView, 'race')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]