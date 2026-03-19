from django.urls import path
from . import views

urlpatterns = [
    path('download/files/', views.DownloadFilesView.as_view()),
]