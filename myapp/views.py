from django.shortcuts import render
from myapp.models import ProfileData, PoleData

def index(request):
    profile_data = ProfileData.objects.all()
    pole_data = PoleData.objects.all()
    return render(request, 'index.html', {'profile_data': profile_data, 'pole_data': pole_data})