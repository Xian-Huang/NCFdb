from django.urls import path
from . import views

app_name = 'perilla'

urlpatterns = [
    path('download/files/', views.DownloadFileView.as_view(), name='download-file-list'),
    path('download/files/<int:pk>/', views.DownloadFileDetailView.as_view(), name='download-file-detail'),
    
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
    
    path('institutions/', views.InstitutionView.as_view(), name='institution-list'),
    path('institutions/<int:pk>/', views.InstitutionDetailView.as_view(), name='institution-detail'),
    
    path('announcements/', views.AnnouncementView.as_view(), name='announcement-list'),
    path('announcements/<int:pk>/', views.AnnouncementDetailView.as_view(), name='announcement-detail'),
    
    path('news/', views.NewsView.as_view(), name='news-list'),
    path('news/<int:pk>/', views.NewsDetailView.as_view(), name='news-detail'),
    
    path('changelogs/', views.ChangelogView.as_view(), name='changelog-list'),
    path('changelogs/<int:pk>/', views.ChangelogDetailView.as_view(), name='changelog-detail'),
]
