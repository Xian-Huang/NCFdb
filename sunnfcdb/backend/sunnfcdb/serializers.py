from rest_framework import serializers
from django.conf import settings
from .models import DownloadFile, News, Changelog, NutritionData, Region, Variety, Gene, GeneExpression, EnvironmentalFactor, Institution, Announcement, Nutrition

DEFAULT_NEWS_IMAGE = "news_images/default-news.png"
NEWS_IMAGE_POOL = [
    "news_images/sunn-database-update.png",
    "news_images/sunn-genome-release.png",
    "news_images/sunn-field-network.png",
    "news_images/sunn-workshop.png",
    "news_images/sunn-nutrition-release.png",
]
NEWS_IMAGE_BY_TITLE = {
    "sunn database update": "news_images/sunn-database-update.png",
    "database update": "news_images/sunn-database-update.png",
    "data curation workshop": "news_images/sunn-workshop.png",
    "data curation": "news_images/sunn-workshop.png",
    "workshop": "news_images/sunn-workshop.png",
    "genome release": "news_images/sunn-genome-release.png",
    "genome": "news_images/sunn-genome-release.png",
    "field network": "news_images/sunn-field-network.png",
    "field": "news_images/sunn-field-network.png",
    "regional": "news_images/sunn-field-network.png",
    "nutrition release": "news_images/sunn-nutrition-release.png",
    "nutrition": "news_images/sunn-nutrition-release.png",
    "metabolome": "news_images/sunn-nutrition-release.png",
}
def build_media_url(request, path):
    url = f"{settings.MEDIA_URL}{str(path).lstrip('/')}"
    return request.build_absolute_uri(url) if request else url

def fallback_news_image(obj):
    text = f"{getattr(obj, 'title', '')} {getattr(obj, 'category', '')} {getattr(obj, 'tags', '')}".lower()
    for keyword, image_path in NEWS_IMAGE_BY_TITLE.items():
        if keyword in text:
            return image_path
    if getattr(obj, "id", None):
        return NEWS_IMAGE_POOL[obj.id % len(NEWS_IMAGE_POOL)]
    return DEFAULT_NEWS_IMAGE

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
        request = self.context.get('request')
        if obj.image and getattr(obj.image, "name", ""):
            image_name = str(obj.image.name).replace("\\", "/")
            if not image_name.startswith(("http://", "https://")) and "/http" not in image_name:
                if not image_name.lower().endswith(".svg") and obj.image.storage.exists(image_name):
                    try:
                        return request.build_absolute_uri(obj.image.url) if request else obj.image.url
                    except ValueError:
                        pass
        return build_media_url(request, fallback_news_image(obj))
    
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


class NutritionDataSerializer(serializers.ModelSerializer):
    variety_name = serializers.CharField(source='variety.name', read_only=True)
    region_name = serializers.CharField(source='variety.region.name', read_only=True)

    class Meta:
        model = NutritionData
        fields = '__all__'
