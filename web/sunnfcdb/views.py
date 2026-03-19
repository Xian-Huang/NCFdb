from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializers import DownloadFileSerializer
# Create your views here.



class DownloadFilesView(APIView):
    def get(self, request, format=None):
        download_files = DownloadFile.objects.all()
        serializer = DownloadFileSerializer(download_files, many=True)
        return Response(serializer.data)
