import requests
from django.core.management.base import BaseCommand
from driver.models import RaceSchedule

class Command(BaseCommand):
    help = 'Populate F1 schedule'

    def handle(self, *args, **options):
        # API endpoint to retrieve all race results for the 2022 season
        # url = 'https://ergast.com/api/f1/{year}/results.json?limit=800'

        schedule_api = "https://ergast.com/api/f1/current.json?limit=800"
        schedule_response = requests.get(schedule_api)
        schedule_data = schedule_response.json()
        print(schedule_data)

        for race_data in schedule_data['MRData']['RaceTable']['Races']:
            RaceSchedule.objects.get_or_create(
                season=race_data['season'],
                round=race_data['round'],
                race_name=race_data['raceName'],
                date=race_data['date'],
                time=race_data['time'][:5],
                circuit_name=race_data['Circuit']['circuitName'],
                location=race_data['Circuit']['Location']['country'],
            )