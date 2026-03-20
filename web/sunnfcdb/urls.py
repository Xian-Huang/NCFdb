from django.urls import path
from . import views

urlpatterns = [
    path('download/files/', views.DownloadFilesView.as_view()),
    path('news/', views.NewsView.as_view()),
    path('news/<int:pk>/', views.NewsDetailView.as_view()),
    path('changelog/', views.ChangelogView.as_view()),
]