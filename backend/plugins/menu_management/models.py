from django.db import models

class PluginMenu(models.Model):
    site = models.ForeignKey('sites.Site', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    
    class Meta:
        managed = True # Plugin models can be managed by Django
