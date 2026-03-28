from rest_framework import serializers
from django.conf import settings
from .models import DownloadFile, News, Changelog, Region, Variety, Gene, GeneExpression, EnvironmentalFactor, Institution, Announcement, Nutrition

class DownloadFileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField("get_file_url",read_only=True)
    
    def get_file_url(self, obj):
        return obj.file_url
    
    class Meta:
        model = DownloadFile
        fields = '__all__'
        read_only_fields = ['file_url']

class NewsSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    class Meta:
        model = News
        fields = '__all__'
        read_only_fields = ['image_url']

class ChangelogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Changelog
        fields = '__all__'

class NutritionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nutrition
        fields = '__all__'

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'

class VarietySerializer(serializers.ModelSerializer):
    region_name = serializers.CharField(source='region.name', read_only=True)
    class Meta:
        model = Variety
        fields = '__all__'

class GeneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gene
        fields = '__all__'

class GeneExpressionSerializer(serializers.ModelSerializer):
    gene_name = serializers.CharField(source='gene.name', read_only=True)
    variety_name = serializers.CharField(source='variety.name', read_only=True)
    
    class Meta:
        model = GeneExpression
        fields = '__all__'
        extra_kwargs = {
            'stage': {'required': False, 'allow_blank': True, 'allow_null': True},
            'fpkm': {'required': False, 'allow_null': True},
            'tpm': {'required': False, 'allow_null': True},
            'sample_id': {'required': False, 'allow_blank': True, 'allow_null': True},
        }

class EnvironmentalFactorSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnvironmentalFactor
        fields = '__all__'

class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = '__all__'

class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'
