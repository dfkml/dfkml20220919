import json
from django.core.management.base import BaseCommand
from myapp.models import ProfileData, PoleData

class Command(BaseCommand):
    help = 'Import data from JSON files'

    def handle(self, *args, **kwargs):
        with open('profileData.json', 'r', encoding='utf-8') as f:
            profile_data = json.load(f)
            for item in profile_data:
                ProfileData.objects.create(
                    dis=item['dis'],
                    img=item['img'],
                    original=item['original'],
                    shorten=item['shorten'],
                    time=item['time']
                )

        with open('poleData.json', 'r', encoding='utf-8') as f:
            pole_data = json.load(f)
            for item in pole_data:
                PoleData.objects.create(
                    image_url=item['image_url'],
                    num=item['num'],
                    prompt=item['prompt'],
                    time=item['time']
                )