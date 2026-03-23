from django.urls import path
from . import views

urlpatterns = [
    path('download/files/', views.DownloadFileView.as_view()),
    path('download/files/<int:pk>/', views.DownloadFileDetailView.as_view()),
    path('news/', views.NewsView.as_view()),
    path('news/<int:pk>/', views.NewsDetailView.as_view()),
    path('changelog/', views.ChangelogView.as_view()),
    path('changelog/<int:pk>/', views.ChangelogDetailView.as_view()),
    path('regions/', views.RegionView.as_view()),
    path('regions/<int:pk>/', views.RegionDetailView.as_view()),
    path('varieties/', views.VarietyView.as_view()),
    path('varieties/<int:pk>/', views.VarietyDetailView.as_view()),
    path('genes/', views.GeneView.as_view()),
    path('genes/<int:pk>/', views.GeneDetailView.as_view()),
    path('gene-expressions/', views.GeneExpressionView.as_view()),
    path('gene-expressions/<int:pk>/', views.GeneExpressionDetailView.as_view()),
    path('environmental-factors/', views.EnvironmentalFactorView.as_view()),
    path('environmental-factors/<int:pk>/', views.EnvironmentalFactorDetailView.as_view()),
    path('nutrition/', views.NutritionView.as_view()),
    path('nutrition/<int:pk>/', views.NutritionDetailView.as_view()),
    path('institutions/', views.InstitutionView.as_view()),
    path('institutions/<int:pk>/', views.InstitutionDetailView.as_view()),
    path('announcements/', views.AnnouncementView.as_view()),
    path('announcements/<int:pk>/', views.AnnouncementDetailView.as_view()),
]
