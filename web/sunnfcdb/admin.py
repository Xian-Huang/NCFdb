from django.contrib import admin
from .models import (
    DownloadFile, News, Changelog, Nutrition,
    Region, Variety, Gene, GeneExpression,
    EnvironmentalFactor, Institution, Announcement
)

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

@admin.register(Nutrition)
class NutritionAdmin(admin.ModelAdmin):
    list_display = ['name', 'create_time', 'update_time']
    search_fields = ['name', 'desc']
    ordering = ['name']

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'country', 'climate']
    search_fields = ['name', 'code', 'country']
    list_filter = ['country', 'climate']
    ordering = ['name']

@admin.register(Variety)
class VarietyAdmin(admin.ModelAdmin):
    list_display = ['name', 'variety_code', 'region', 'seed_color', 'oil_content', 'maturity_days']
    search_fields = ['name', 'variety_code']
    list_filter = ['region', 'seed_color']
    ordering = ['name']

@admin.register(Gene)
class GeneAdmin(admin.ModelAdmin):
    list_display = ['gene_id', 'name', 'symbol', 'chromosome', 'gene_type', 'pathway']
    search_fields = ['gene_id', 'name', 'symbol', 'pathway']
    list_filter = ['chromosome', 'gene_type', 'pathway']
    ordering = ['gene_id']

@admin.register(GeneExpression)
class GeneExpressionAdmin(admin.ModelAdmin):
    list_display = ['gene', 'variety', 'tissue', 'stage', 'expression_value', 'create_time']
    search_fields = ['gene__gene_id', 'gene__name', 'variety__name', 'tissue']
    list_filter = ['tissue', 'stage']
    ordering = ['-create_time']

@admin.register(EnvironmentalFactor)
class EnvironmentalFactorAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'unit', 'category', 'min_value', 'max_value']
    search_fields = ['name', 'code', 'category']
    list_filter = ['category']
    ordering = ['name']

@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = ['name', 'abbreviation', 'country', 'city', 'institution_type']
    search_fields = ['name', 'abbreviation', 'country', 'city']
    list_filter = ['country', 'institution_type']
    ordering = ['name']

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', 'announcement_type', 'author', 'institution', 'importance', 'publish_date', 'is_published']
    search_fields = ['title', 'content', 'author']
    list_filter = ['announcement_type', 'importance', 'is_published', 'publish_date']
    readonly_fields = ['views', 'create_time', 'update_time']
    ordering = ['-publish_date', '-create_time']
    list_editable = ['is_published']
    date_hierarchy = 'publish_date'
