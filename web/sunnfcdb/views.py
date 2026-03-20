from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import DownloadFileSerializer, NewsSerializer, ChangelogSerializer
# Create your views here.



class DownloadFilesView(APIView):
    def get(self, request, format=None):
        download_files = DownloadFile.objects.all()
        serializer = DownloadFileSerializer(download_files, many=True)
        return Response(serializer.data)


class NewsView(APIView):
    def get(self, request, format=None):
        news = News.objects.filter(is_published=True)
        serializer = NewsSerializer(news, many=True)
        return Response(serializer.data)


class NewsDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            news = News.objects.get(pk=pk, is_published=True)
            serializer = NewsSerializer(news)
            return Response(serializer.data)
        except News.DoesNotExist:
            return Response({"error": "News not found"}, status=status.HTTP_404_NOT_FOUND)


class ChangelogView(APIView):
    def get(self, request, format=None):
        changelog = Changelog.objects.filter(is_published=True)
        serializer = ChangelogSerializer(changelog, many=True)
        return Response(serializer.data)
