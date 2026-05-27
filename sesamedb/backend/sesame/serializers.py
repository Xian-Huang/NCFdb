import re

from rest_framework import serializers
from django.conf import settings
from .models import DownloadFile, Region, Variety, Gene, GeneExpression, EnvironmentalFactor, Institution, Announcement, News, Changelog, NutritionData

DEFAULT_NEWS_IMAGE = "news_images/default-news.png"
NEWS_IMAGE_POOL = [
    "news_images/sesame-high-oil-variety.png",
    "news_images/sesame-consortium-meeting.png",
    "news_images/sesame-genome-v2.png",
    "news_images/sesame-breeding-workshop.png",
    "news_images/sesame-production-record.png",
]
NEWS_IMAGE_BY_TITLE = {
    "new high-oil content sesame variety released": "news_images/sesame-high-oil-variety.png",
    "high-oil content sesame": "news_images/sesame-high-oil-variety.png",
    "zhongzhi": "news_images/sesame-high-oil-variety.png",
    "international sesame genomics consortium meeting 2026": "news_images/sesame-consortium-meeting.png",
    "sesame genomics consortium": "news_images/sesame-consortium-meeting.png",
    "sesame genome sequence v2.0 now available": "news_images/sesame-genome-v2.png",
    "genome sequence v2.0": "news_images/sesame-genome-v2.png",
    "sesame genome": "news_images/sesame-genome-v2.png",
    "workshop on sesame breeding technologies": "news_images/sesame-breeding-workshop.png",
    "sesame breeding technologies": "news_images/sesame-breeding-workshop.png",
    "global sesame production reaches record high": "news_images/sesame-production-record.png",
    "global sesame production": "news_images/sesame-production-record.png",
    "record high": "news_images/sesame-production-record.png",
    "initial release": "news_images/default-news.png",
    "new features and improvements": "news_images/sesame-genome-v2.png",
    "scheduled maintenance": "news_images/sesame-consortium-meeting.png",
    "data submission guidelines": "news_images/sesame-breeding-workshop.png",
    "database update": "news_images/sesame-production-record.png",
}
NEWS_CONTENT_MIN_WORDS = 600
NEWS_WORD_PATTERN = re.compile(r"\b[A-Za-z]+(?:[-'][A-Za-z]+)*\b")


def news_content_word_count(value):
    return len(NEWS_WORD_PATTERN.findall(str(value or "")))


def news_content_paragraph_count(value):
    plain_text = re.sub(r"</p\s*>", "\n\n", str(value or ""), flags=re.IGNORECASE)
    plain_text = re.sub(r"<[^>]*>", "", plain_text)
    return len([paragraph for paragraph in re.split(r"\r?\n\s*\r?\n", plain_text) if paragraph.strip()])


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
