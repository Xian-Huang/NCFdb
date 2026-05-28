import re

from rest_framework import serializers
from django.conf import settings
from .models import DownloadFile, Region, Variety, Gene, GeneExpression, EnvironmentalFactor, Institution, Announcement, News, Changelog, NutritionData

DEFAULT_NEWS_IMAGE = "news_images/default-news.png"
NEWS_IMAGE_POOL = [
    "news_images/perilla-cold-climate-variety.png",
    "news_images/perilla-symposium-2026.png",
    "news_images/perilla-genome-release.png",
    "news_images/perilla-metabolite-lab.png",
]
NEWS_IMAGE_BY_TITLE = {
    "new high-oil perilla variety released": "news_images/perilla-cold-climate-variety.png",
    "cold-climate": "news_images/perilla-cold-climate-variety.png",
    "high-oil perilla": "news_images/perilla-cold-climate-variety.png",
    "perilla variety": "news_images/perilla-cold-climate-variety.png",
    "international perilla research symposium 2026": "news_images/perilla-symposium-2026.png",
    "perilla research symposium": "news_images/perilla-symposium-2026.png",
    "changchun": "news_images/perilla-symposium-2026.png",
    "perilla genome sequence now available": "news_images/perilla-genome-release.png",
    "perilla genome": "news_images/perilla-genome-release.png",
    "initial release": "news_images/perilla-metabolite-lab.png",
    "welcome to perilladb": "news_images/perilla-metabolite-lab.png",
    "database update": "news_images/perilla-metabolite-lab.png",
}
NEWS_CONTENT_MIN_WORDS = 600
NEWS_WORD_PATTERN = re.compile(r"\b[A-Za-z]+(?:[-'][A-Za-z]+)*\b")
API_MEDIA_URL = "/api/media/"


def news_content_word_count(value):
    return len(NEWS_WORD_PATTERN.findall(str(value or "")))


def news_content_paragraph_count(value):
    plain_text = re.sub(r"</p\s*>", "\n\n", str(value or ""), flags=re.IGNORECASE)
    plain_text = re.sub(r"<[^>]*>", "", plain_text)
    return len([paragraph for paragraph in re.split(r"\r?\n\s*\r?\n", plain_text) if paragraph.strip()])


def build_media_url(request, path):
    path = str(path).replace("\\", "/")
    media_url = settings.MEDIA_URL.rstrip("/")
    if path.startswith(media_url):
        path = path[len(media_url):]
    url = f"{API_MEDIA_URL}{path.lstrip('/')}"
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
    content = serializers.CharField(required=True, allow_blank=False, allow_null=False)

    def validate_content(self, value):
        word_count = news_content_word_count(value)
        if word_count < NEWS_CONTENT_MIN_WORDS:
            raise serializers.ValidationError(
                f"News content must contain at least {NEWS_CONTENT_MIN_WORDS} English words; currently {word_count}."
            )
        if news_content_paragraph_count(value) < 2:
            raise serializers.ValidationError(
                "News content must be split into at least two paragraphs separated by a blank line."
            )
        return value
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and getattr(obj.image, "name", ""):
            image_name = str(obj.image.name).replace("\\", "/")
            if not image_name.startswith(("http://", "https://")) and "/http" not in image_name:
                if not image_name.lower().endswith(".svg") and obj.image.storage.exists(image_name):
                    try:
                        return build_media_url(request, image_name)
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
