from django.contrib import admin
from .models import DownloadFile, News, Changelog

@admin.register(DownloadFile)
class DownloadFileAdmin(admin.ModelAdmin):
    list_display = ['title', 'format', 'size', 'downloads', 'version', 'create_time', 'update_time']
    search_fields = ['title', 'description', 'version']
    list_filter = ['format', 'create_time']
    readonly_fields = ['downloads', 'create_time', 'update_time']
    ordering = ['-create_time']

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'views', 'is_published', 'publish_time', 'create_time']
    search_fields = ['title', 'content', 'author', 'tags']
    list_filter = ['category', 'is_published', 'create_time', 'publish_time']
    readonly_fields = ['views', 'create_time', 'update_time']
    ordering = ['-publish_time', '-create_time']
    list_editable = ['is_published']
    date_hierarchy = 'publish_time'

@admin.register(Changelog)
class ChangelogAdmin(admin.ModelAdmin):
    list_display = ['version', 'title', 'release_date', 'is_published']
    search_fields = ['title', 'content', 'version']
    list_filter = ['release_date', 'is_published']
    readonly_fields = ['create_time']
    ordering = ['-release_date']
    list_editable = ['is_published']
