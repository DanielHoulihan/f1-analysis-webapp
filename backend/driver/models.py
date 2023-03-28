from django.db import models

# Create your models here.

class Todo(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)

    def _str_(self):
        return self.title


class Race(models.Model):
    season = models.IntegerField()
    round = models.IntegerField()
    race_name = models.CharField(max_length=255)
    date = models.DateField()
    time = models.TimeField(null=True)
    circuit_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.season} Round {self.round} - {self.race_name}'

class Driver(models.Model):
    driver_id = models.CharField(max_length=255, primary_key=True)
    driver_code = models.CharField(max_length=3, null=True)
    driver_number = models.IntegerField(null=True)
    driver_name = models.CharField(max_length=255)
    nationality = models.CharField(max_length=255)


class Constructor(models.Model):
    constructor_id = models.CharField(max_length=255, primary_key=True)
    constructor_name = models.CharField(max_length=255)
    nationality = models.CharField(max_length=255)

    def __str__(self):
        return self.constructor_name

class Result(models.Model):
    race = models.ForeignKey(Race, on_delete=models.CASCADE)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    constructor = models.ForeignKey(Constructor, on_delete=models.CASCADE)
    grid = models.IntegerField()
    position = models.IntegerField()
    points = models.DecimalField(max_digits=5, decimal_places=2)
    laps = models.IntegerField()
    status = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.driver.driver_name} - {self.race}'
