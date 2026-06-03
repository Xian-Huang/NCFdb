from django.urls import path
from . import views

app_name = 'sesame'

urlpatterns = [
    path('nutrition-data/', views.NutritionDataView.as_view(), name='nutrition-data-list'),
    path('nutrition-data/<int:pk>/', views.NutritionDataDetailView.as_view(), name='nutrition-data-detail'),
    path('search/', views.GlobalSearchView.as_view(), name='global-search'),
    path('visualizations/', views.VisualizationSummaryView.as_view(), name='visualization-summary'),
    path('export/<str:entity>/', views.DataExportView.as_view(), name='data-export'),
    path('download/files/', views.DownloadFileView.as_view(), name='download-file-list'),
    path('download/files/<int:pk>/', views.DownloadFileDetailView.as_view(), name='download-file-detail'),
    path('download/files/<int:pk>/download/', views.DownloadFileDownloadView.as_view(), name='download-file-download'),
    
    path('regions/', views.RegionView.as_view(), name='region-list'),
    path('regions/<int:pk>/', views.RegionDetailView.as_view(), name='region-detail'),
    
    path('varieties/', views.VarietyView.as_view(), name='variety-list'),
    path('varieties/<int:pk>/', views.VarietyDetailView.as_view(), name='variety-detail'),
    
    path('genes/', views.GeneView.as_view(), name='gene-list'),
    path('genes/<int:pk>/', views.GeneDetailView.as_view(), name='gene-detail'),
    path('gene-associations/', views.GeneAssociationView.as_view(), name='gene-association-list'),
    path('gene-associations/<int:pk>/', views.GeneAssociationDetailView.as_view(), name='gene-association-detail'),
    
    path('gene-expressions/', views.GeneExpressionView.as_view(), name='gene-expression-list'),
    path('gene-expressions/<int:pk>/', views.GeneExpressionDetailView.as_view(), name='gene-expression-detail'),
    
    path('environmental-factors/', views.EnvironmentalFactorView.as_view(), name='environmental-factor-list'),
    path('environmental-factors/<int:pk>/', views.EnvironmentalFactorDetailView.as_view(), name='environmental-factor-detail'),
    path('regional-map-sites/', views.RegionalMapSiteView.as_view(), name='regional-map-site-list'),
    path('regional-map-sites/<int:pk>/', views.RegionalMapSiteDetailView.as_view(), name='regional-map-site-detail'),
    path('regional-environment-values/', views.RegionalEnvironmentValueView.as_view(), name='regional-environment-value-list'),
    path('regional-environment-values/<int:pk>/', views.RegionalEnvironmentValueDetailView.as_view(), name='regional-environment-value-detail'),
    path('marker-loci/', views.MarkerLocusView.as_view(), name='marker-locus-list'),
    path('marker-loci/<int:pk>/', views.MarkerLocusDetailView.as_view(), name='marker-locus-detail'),
    path('molecular-fingerprints/', views.MolecularFingerprintView.as_view(), name='molecular-fingerprint-list'),
    path('molecular-fingerprints/<int:pk>/', views.MolecularFingerprintDetailView.as_view(), name='molecular-fingerprint-detail'),
    path('sequencing-data/', views.SequencingDataView.as_view(), name='sequencing-data-list'),
    path('sequencing-data/<int:pk>/', views.SequencingDataDetailView.as_view(), name='sequencing-data-detail'),
    path('germplasm-resources/', views.GermplasmResourceView.as_view(), name='germplasm-resource-list'),
    path('germplasm-resources/<int:pk>/', views.GermplasmResourceDetailView.as_view(), name='germplasm-resource-detail'),
    path('genetic-diversity-analyses/', views.GeneticDiversityAnalysisView.as_view(), name='genetic-diversity-analysis-list'),
    path('genetic-diversity-analyses/<int:pk>/', views.GeneticDiversityAnalysisDetailView.as_view(), name='genetic-diversity-analysis-detail'),
    path('batch/<str:entity>/', views.BatchCreateView.as_view(), name='batch-create'),
    
    path('institutions/', views.InstitutionView.as_view(), name='institution-list'),
    path('institutions/<int:pk>/', views.InstitutionDetailView.as_view(), name='institution-detail'),
    
    path('announcements/', views.AnnouncementView.as_view(), name='announcement-list'),
    path('announcements/<int:pk>/', views.AnnouncementDetailView.as_view(), name='announcement-detail'),
    
    path('news/', views.NewsView.as_view(), name='news-list'),
    path('news/<int:pk>/', views.NewsDetailView.as_view(), name='news-detail'),
    path('news/scrolling/', views.ScrollingNewsView.as_view(), name='scrolling-news'),
    path('event-registrations/', views.EventRegistrationView.as_view(), name='event-registration-list'),

    path('changelogs/', views.ChangelogView.as_view(), name='changelog-list'),
    path('changelogs/<int:pk>/', views.ChangelogDetailView.as_view(), name='changelog-detail'),
]

