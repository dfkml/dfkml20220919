from django.db import models

class ProfileData(models.Model):
    dis = models.TextField()
    img = models.URLField()
    original = models.TextField()
    shorten = models.TextField()
    time = models.DateTimeField()

class PoleData(models.Model):
    image_url = models.URLField()
    num = models.CharField(max_length=10)
    prompt = models.TextField()
    time = models.DateTimeField()
