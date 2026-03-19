from rest_framework import serializers
from django.conf import settings
from .models import DownloadFile

class DownloadFileSerializer(serializers.ModelSerializer):
    
    file_url = serializers.SerializerMethodField("get_file_url",read_only=True)
    
    def get_file_url(self, obj):
        return obj.file_url
    
    class Meta:
        model = DownloadFile
        fields = '__all__'
        read_only_fields = ['file_url']