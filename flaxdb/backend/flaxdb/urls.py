from django.urls import path
from . import views

app_name = 'flaxdb'

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
    
    path('gene-expressions/', views.GeneExpressionView.as_view(), name='gene-expression-list'),
    path('gene-expressions/<int:pk>/', views.GeneExpressionDetailView.as_view(), name='gene-expression-detail'),
    
    path('environmental-factors/', views.EnvironmentalFactorView.as_view(), name='environmental-factor-list'),
    path('environmental-factors/<int:pk>/', views.EnvironmentalFactorDetailView.as_view(), name='environmental-factor-detail'),
    path('regional-map-sites/', views.RegionalMapSiteView.as_view(), name='regional-map-site-list'),
    path('regional-map-sites/<int:pk>/', views.RegionalMapSiteDetailView.as_view(), name='regional-map-site-detail'),
    path('regional-environment-values/', views.RegionalEnvironmentValueView.as_view(), name='regional-environment-value-list'),
    path('regional-environment-values/<int:pk>/', views.RegionalEnvironmentValueDetailView.as_view(), name='regional-environment-value-detail'),
    
    path('institutions/', views.InstitutionView.as_view(), name='institution-list'),
    path('institutions/<int:pk>/', views.InstitutionDetailView.as_view(), name='institution-detail'),
    
    path('announcements/', views.AnnouncementView.as_view(), name='announcement-list'),
    path('announcements/<int:pk>/', views.AnnouncementDetailView.as_view(), name='announcement-detail'),
    
    path('news/', views.NewsView.as_view(), name='news-list'),
    path('news/<int:pk>/', views.NewsDetailView.as_view(), name='news-detail'),
    path('news/scrolling/', views.ScrollingNewsView.as_view(), name='scrolling-news'),

    path('changelogs/', views.ChangelogView.as_view(), name='changelog-list'),
    path('changelogs/<int:pk>/', views.ChangelogDetailView.as_view(), name='changelog-detail'),
]
