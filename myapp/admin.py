# myapp/admin.py
from django.contrib import admin
from .models import ProfileData, PoleData

# 注册 ProfileData 模型
@admin.register(ProfileData)
class ProfileDataAdmin(admin.ModelAdmin):
    list_display = ('time', 'original', 'dis', 'img')
    search_fields = ('time', 'original', 'dis', 'img')
    list_filter = ('time',)

# 注册 PoleData 模型
@admin.register(PoleData)
class PoleDataAdmin(admin.ModelAdmin):
    list_display = ('time', 'num', 'prompt', 'image_url')
    search_fields = ('time', 'num', 'prompt', 'image_url')
    list_filter = ('time',)
