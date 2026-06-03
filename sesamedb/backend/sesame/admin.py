from django.contrib import admin
from .models import (
    DownloadFile, Region, Variety, Gene, GeneExpression, GeneAssociation,
    EnvironmentalFactor, Institution, Announcement, News, Changelog, EventRegistration,
    MarkerLocus, MolecularFingerprint, SequencingData, GermplasmResource, GeneticDiversityAnalysis
)

@admin.register(DownloadFile)
class DownloadFileAdmin(admin.ModelAdmin):
    list_display = ['file_name', 'file_type', 'file_size', 'category', 'version', 'is_published']
    search_fields = ['file_name', 'description', 'category']
    list_filter = ['file_type', 'category', 'is_published']
    ordering = ['-create_time']
    list_editable = ['is_published']

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
    list_display = ['gene', 'variety', 'tissue', 'stage', 'expression_value']
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
    ordering = ['-release_date']
    list_editable = ['is_published']


@admin.register(GeneAssociation)
class GeneAssociationAdmin(admin.ModelAdmin):
    list_display = ['source_gene', 'target_display', 'association_type', 'confidence_score', 'p_value', 'effect_size', 'evidence_source', 'is_active']
    search_fields = ['source_gene__gene_id', 'source_gene__name', 'target_gene__gene_id', 'target_gene__name', 'target_trait', 'evidence_source', 'description']
    list_filter = ['association_type', 'is_active', 'evidence_source']
    list_editable = ['is_active']
    raw_id_fields = ['source_gene', 'target_gene']
    ordering = ['-confidence_score', 'source_gene__gene_id']

    @admin.display(description='目标')
    def target_display(self, obj):
        return obj.target_gene or obj.target_trait

@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ['event_title', 'name', 'institution', 'attendance_mode', 'participant_count', 'status', 'create_time']
    search_fields = ['event_title', 'name', 'institution', 'email', 'phone']
    list_filter = ['attendance_mode', 'status', 'event_title', 'create_time']
    readonly_fields = ['event_id', 'event_title', 'event_date', 'event_location', 'name', 'institution', 'email', 'phone', 'attendance_mode', 'participant_count', 'note', 'create_time', 'update_time']
    list_editable = ['status']
    ordering = ['-create_time']
    date_hierarchy = 'create_time'


@admin.register(MarkerLocus)
class MarkerLocusAdmin(admin.ModelAdmin):
    list_display = ['marker_id', 'marker_name', 'marker_type', 'chromosome', 'position', 'associated_trait', 'pic']
    search_fields = ['marker_id', 'marker_name', 'chromosome', 'associated_trait', 'annotated_gene']
    list_filter = ['marker_type', 'chromosome']
    ordering = ['marker_type', 'chromosome', 'position']


@admin.register(MolecularFingerprint)
class MolecularFingerprintAdmin(admin.ModelAdmin):
    list_display = ['variety', 'marker', 'genotype_code', 'allele1', 'allele2', 'fragment_size', 'quality_score']
    search_fields = ['variety__name', 'variety__variety_code', 'marker__marker_id', 'genotype_code']
    list_filter = ['marker__marker_type', 'quality_score']
    raw_id_fields = ['variety', 'marker']
    ordering = ['variety__name', 'marker__marker_id']


@admin.register(SequencingData)
class SequencingDataAdmin(admin.ModelAdmin):
    list_display = ['variety', 'accession_number', 'data_type', 'platform', 'coverage', 'public_database', 'submission_date']
    search_fields = ['variety__name', 'variety__variety_code', 'accession_number', 'platform', 'public_database']
    list_filter = ['data_type', 'platform', 'public_database', 'submission_date']
    raw_id_fields = ['variety']
    ordering = ['-submission_date', 'variety__name']


@admin.register(GermplasmResource)
class GermplasmResourceAdmin(admin.ModelAdmin):
    list_display = ['variety', 'germplasm_number', 'germplasm_type', 'collection_site', 'collection_year', 'has_molecular_data', 'has_sequencing_data']
    search_fields = ['variety__name', 'variety__variety_code', 'germplasm_number', 'collection_site', 'donor_institution']
    list_filter = ['germplasm_type', 'collection_year', 'has_molecular_data', 'has_sequencing_data']
    raw_id_fields = ['variety']
    ordering = ['variety__name']


@admin.register(GeneticDiversityAnalysis)
class GeneticDiversityAnalysisAdmin(admin.ModelAdmin):
    list_display = ['analysis_name', 'analysis_type', 'marker_type', 'marker_count', 'variety_count', 'analysis_date']
    search_fields = ['analysis_name', 'marker_type', 'description']
    list_filter = ['analysis_type', 'marker_type', 'analysis_date']
    ordering = ['-analysis_date', '-create_time']

