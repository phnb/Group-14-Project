# Generated by Django 3.2.12 on 2022-04-16 09:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authsys', '0005_auto_20220416_1101'),
        ('cashapp', '0005_account_is_default'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='userProfile',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='accounts', to='authsys.userprofile'),
        ),
    ]