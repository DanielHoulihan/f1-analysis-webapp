# Generated by Django 4.1.5 on 2023-03-26 12:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Constructor",
            fields=[
                (
                    "constructor_id",
                    models.CharField(max_length=255, primary_key=True, serialize=False),
                ),
                ("constructor_name", models.CharField(max_length=255)),
                ("nationality", models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name="Driver",
            fields=[
                (
                    "driver_id",
                    models.CharField(max_length=255, primary_key=True, serialize=False),
                ),
                ("driver_code", models.CharField(max_length=3, null=True)),
                ("driver_number", models.IntegerField(null=True)),
                ("driver_name", models.CharField(max_length=255)),
                ("nationality", models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name="Race",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("season", models.IntegerField()),
                ("round", models.IntegerField()),
                ("race_name", models.CharField(max_length=255)),
                ("date", models.DateField()),
                ("time", models.TimeField(null=True)),
                ("circuit_name", models.CharField(max_length=255)),
                ("location", models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name="Todo",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=120)),
                ("description", models.TextField()),
                ("completed", models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name="Result",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("grid", models.IntegerField()),
                ("position", models.IntegerField()),
                ("points", models.DecimalField(decimal_places=2, max_digits=5)),
                ("laps", models.IntegerField()),
                ("status", models.CharField(max_length=255)),
                (
                    "constructor",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="driver.constructor",
                    ),
                ),
                (
                    "driver",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="driver.driver"
                    ),
                ),
                (
                    "race",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="driver.race"
                    ),
                ),
            ],
        ),
    ]
