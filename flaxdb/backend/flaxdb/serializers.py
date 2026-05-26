from rest_framework import serializers
from django.conf import settings
from .models import DownloadFile, Region, Variety, Gene, GeneExpression, EnvironmentalFactor, Institution, Announcement, News, Changelog, NutritionData

DEFAULT_NEWS_IMAGE = "news_images/default-news.png"
NEWS_IMAGE_POOL = [
    "news_images/flax-ala-variety.png",
    "news_images/flax-conference-2026.png",
    "news_images/flax-genome-release.png",
    "news_images/flax-database-curation.png",
]
NEWS_IMAGE_BY_TITLE = {
    "new high-ala flax variety released": "news_images/flax-ala-variety.png",
    "high-ala": "news_images/flax-ala-variety.png",
    "ala flax": "news_images/flax-ala-variety.png",
    "flax variety": "news_images/flax-ala-variety.png",
    "international flax research conference 2026": "news_images/flax-conference-2026.png",
    "international flax research conference": "news_images/flax-conference-2026.png",
    "bast fiber conference": "news_images/flax-conference-2026.png",
    "flax genome sequence now available": "news_images/flax-genome-release.png",
    "flax genome": "news_images/flax-genome-release.png",
    "initial release": "news_images/flax-database-curation.png",
    "welcome to flaxdb": "news_images/flax-database-curation.png",
    "database update": "news_images/flax-database-curation.png",
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
    class Meta:
        model = DownloadFile
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
    class Meta:
        model = GeneExpression
        fields = '__all__'

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


class NutritionDataSerializer(serializers.ModelSerializer):
    variety_name = serializers.CharField(source='variety.name', read_only=True)
    region_name = serializers.CharField(source='variety.region.name', read_only=True)

    class Meta:
        model = NutritionData
        fields = '__all__'
