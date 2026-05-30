import re

from rest_framework import serializers
from django.conf import settings
from .models import DownloadFile, News, Changelog, NutritionData, Region, Variety, Gene, GeneExpression, EnvironmentalFactor, RegionalMapSite, RegionalEnvironmentValue, Institution, Announcement, Nutrition

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

NEWS_CONTENT_MIN_WORDS = 600
NEWS_WORD_PATTERN = re.compile(r"\b[A-Za-z]+(?:[-'][A-Za-z]+)*\b")
NEWS_CJK_PATTERN = re.compile(r"[\u3400-\u9fff]")
NEWS_CONTENT_MIN_CJK_CHARS = 180
API_MEDIA_URL = "/api/media/"


def news_content_word_count(value):
    return len(NEWS_WORD_PATTERN.findall(str(value or "")))


def news_content_cjk_count(value):
    return len(NEWS_CJK_PATTERN.findall(str(value or "")))


def news_content_paragraph_count(value):
    plain_text = re.sub(r"</p\s*>", "\n\n", str(value or ""), flags=re.IGNORECASE)
    plain_text = re.sub(r"<[^>]*>", "", plain_text)
    return len([paragraph for paragraph in re.split(r"\r?\n\s*\r?\n", plain_text) if paragraph.strip()])


def build_media_url(request, path):
    path = str(path).replace("\\", "/")
    media_url = settings.MEDIA_URL.rstrip("/")
    if path.startswith(media_url):
        path = path[len(media_url):]
    return f"{API_MEDIA_URL}{path.lstrip('/')}"

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
    content = serializers.CharField(required=True, allow_blank=False, allow_null=False)

    def validate_content(self, value):
        word_count = news_content_word_count(value)
        cjk_count = news_content_cjk_count(value)
        if word_count < NEWS_CONTENT_MIN_WORDS and cjk_count < NEWS_CONTENT_MIN_CJK_CHARS:
            raise serializers.ValidationError(
                f"News content must contain at least {NEWS_CONTENT_MIN_WORDS} English words or {NEWS_CONTENT_MIN_CJK_CHARS} Chinese characters; currently {word_count} English words and {cjk_count} Chinese characters."
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


class NewsListSerializer(NewsSerializer):
    content = serializers.SerializerMethodField()

    def get_content(self, obj):
        plain_text = re.sub(r"<[^>]*>", " ", str(getattr(obj, "content", "") or ""))
        plain_text = re.sub(r"\s+", " ", plain_text).strip()
        if len(plain_text) > 260:
            return f"{plain_text[:260].rstrip()}..."
        return plain_text

    class Meta(NewsSerializer.Meta):
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

class RegionalEnvironmentValueSerializer(serializers.ModelSerializer):
    site_name = serializers.CharField(source='site.name', read_only=True)
    factor_name = serializers.CharField(source='factor.name', read_only=True)
    factor_code = serializers.CharField(source='factor.code', read_only=True)
    factor_unit = serializers.CharField(source='factor.unit', read_only=True)
    factor_category = serializers.CharField(source='factor.category', read_only=True)

    class Meta:
        model = RegionalEnvironmentValue
        fields = '__all__'

class RegionalMapSiteSerializer(serializers.ModelSerializer):
    region_name = serializers.CharField(source='region.name', read_only=True)
    region_code = serializers.CharField(source='region.code', read_only=True)
    variety_names = serializers.SerializerMethodField()
    environment_values = RegionalEnvironmentValueSerializer(many=True, read_only=True)

    def get_variety_names(self, obj):
        return [variety.name for variety in obj.varieties.all()]

    class Meta:
        model = RegionalMapSite
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
