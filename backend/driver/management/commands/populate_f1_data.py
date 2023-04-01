import requests
from django.core.management.base import BaseCommand
from driver.models import Race, Driver, Constructor, Result

class Command(BaseCommand):
    help = 'Populate F1 data'

    def handle(self, *args, **options):
        # API endpoint to retrieve all race results for the 2022 season
        # url = 'https://ergast.com/api/f1/{year}/results.json?limit=800'

        for year in range(2018, 2023):
            url = f'https://ergast.com/api/f1/%s/results.json?limit=800' % year

            response = requests.get(url)
            data = response.json()

            # Retrieve data from the API
            response = requests.get(url)
            data = response.json()

            # Loop through each race and save the data to Django models
            for race_data in data['MRData']['RaceTable']['Races']:
                # Save the race data to the Race model
                race = Race.objects.create(
                    season=race_data['season'],
                    round=race_data['round'],
                    race_name=race_data['raceName'],
                    date=race_data['date'],
                    time=race_data['time'][:5],
                    circuit_name=race_data['Circuit']['circuitName'],
                    location=race_data['Circuit']['Location']['country'],
                )

                # Loop through each result and save the data to the Result model
                for result_data in race_data['Results']:
                    # Save the driver data to the Driver model
                    driver_data = result_data['Driver']
                    driver, _ = Driver.objects.get_or_create(
                        driver_id=driver_data['driverId'],
                        defaults={
                            'driver_code': driver_data['code'],
                            'driver_number': driver_data['permanentNumber'],
                            'driver_name': driver_data['givenName'] + ' ' + driver_data['familyName'],
                            'nationality': driver_data['nationality'],
                        }
                    )

                    # Save the constructor data to the Constructor model
                    constructor_data = result_data['Constructor']
                    constructor, _ = Constructor.objects.get_or_create(
                        constructor_id=constructor_data['constructorId'],
                        defaults={
                            'constructor_name': constructor_data['name'],
                            'nationality': constructor_data['nationality'],
                        }
                    )

                    # Save the result data to the Result model
                    Result.objects.create(
                        race=race,
                        driver=driver,
                        constructor=constructor,
                        grid=result_data['grid'],
                        position=result_data['position'],
                        points=result_data['points'],
                        laps=result_data['laps'],
                        status=result_data['status'],
                    )

        self.stdout.write(self.style.SUCCESS('Successfully populated F1 data'))
