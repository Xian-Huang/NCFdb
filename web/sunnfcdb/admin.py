from django.contrib import admin
from .models import DownloadFile

@admin.register(DownloadFile)
class DownloadFileAdmin(admin.ModelAdmin):
    list_display = ['title', 'format', 'size', 'downloads', 'version', 'create_time', 'update_time']
    search_fields = ['title', 'description', 'version']
    list_filter = ['format', 'create_time']
    readonly_fields = ['downloads', 'create_time', 'update_time']
    ordering = ['-create_time']
