import re

from rest_framework import serializers
from django.conf import settings
from .models import (
    DownloadFile, Region, Variety, Gene, GeneExpression, EnvironmentalFactor, RegionalMapSite,
    RegionalEnvironmentValue, Institution, Announcement, News, Changelog, NutritionData,
    EventRegistration, GeneAssociation, MarkerLocus, MolecularFingerprint, SequencingData,
    GermplasmResource, GeneticDiversityAnalysis
)

DEFAULT_NEWS_IMAGE = "news_images/default-news.png"
NEWS_IMAGE_POOL = [
    "news_images/flax-ala-variety.png",
    "news_images/flax-conference-2026.png",
    "news_images/flax-genome-release.png",
    "news_images/flax-database-curation.png",
]
NEWS_IMAGE_BY_TITLE = {
    "flax": "news_images/flax-ala-variety.png",
    "alpha-linolenic": "news_images/flax-ala-variety.png",
    "ala": "news_images/flax-ala-variety.png",
    "nutrition": "news_images/flax-database-curation.png",
    "database": "news_images/flax-database-curation.png",
    "genome": "news_images/flax-genome-release.png",
    "conference": "news_images/flax-conference-2026.png",
    "meeting": "news_images/flax-conference-2026.png",
    "workshop": "news_images/flax-conference-2026.png",
    "initial release": "news_images/default-news.png",
    "new features and improvements": "news_images/flax-database-curation.png",
    "scheduled maintenance": "news_images/flax-conference-2026.png",
    "data submission guidelines": "news_images/flax-conference-2026.png",
    "database update": "news_images/flax-database-curation.png",
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


class GeneAssociationSerializer(serializers.ModelSerializer):
    source_gene_id = serializers.CharField(source='source_gene.gene_id', read_only=True)
    source_gene_name = serializers.CharField(source='source_gene.name', read_only=True)
    target_gene_id = serializers.CharField(source='target_gene.gene_id', read_only=True)
    target_gene_name = serializers.CharField(source='target_gene.name', read_only=True)
    source = serializers.SerializerMethodField()
    target = serializers.SerializerMethodField()
    label = serializers.SerializerMethodField()
    weight = serializers.SerializerMethodField()

    class Meta:
        model = GeneAssociation
        fields = '__all__'
        extra_kwargs = {
            'target_trait': {'required': False, 'allow_blank': True, 'allow_null': True},
            'target_gene': {'required': False, 'allow_null': True},
            'p_value': {'required': False, 'allow_null': True},
            'effect_size': {'required': False, 'allow_null': True},
            'evidence_source': {'required': False, 'allow_blank': True, 'allow_null': True},
            'description': {'required': False, 'allow_blank': True, 'allow_null': True},
        }

    def get_source(self, obj):
        return obj.source_gene.gene_id

    def get_target(self, obj):
        return obj.target_gene.gene_id if obj.target_gene else obj.target_trait

    def get_label(self, obj):
        return obj.get_association_type_display()

    def get_weight(self, obj):
        return float(obj.confidence_score or 0)

    def validate(self, attrs):
        target_gene = attrs.get('target_gene')
        target_trait = attrs.get('target_trait')
        if not target_gene and not str(target_trait or '').strip():
            raise serializers.ValidationError({'target_trait': '目标基因和目标性状至少填写一项。'})
        return attrs


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


class MarkerLocusSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarkerLocus
        fields = '__all__'


class MolecularFingerprintSerializer(serializers.ModelSerializer):
    marker = serializers.SlugRelatedField(slug_field='marker_id', queryset=MarkerLocus.objects.all())
    variety_name = serializers.CharField(source='variety.name', read_only=True)
    variety_code = serializers.CharField(source='variety.variety_code', read_only=True)
    marker_name = serializers.CharField(source='marker.marker_name', read_only=True)
    marker_type = serializers.CharField(source='marker.marker_type', read_only=True)
    chromosome = serializers.CharField(source='marker.chromosome', read_only=True)
    marker_id = serializers.CharField(source='marker.marker_id', read_only=True)

    class Meta:
        model = MolecularFingerprint
        fields = '__all__'


class SequencingDataSerializer(serializers.ModelSerializer):
    variety_name = serializers.CharField(source='variety.name', read_only=True)
    variety_code = serializers.CharField(source='variety.variety_code', read_only=True)

    class Meta:
        model = SequencingData
        fields = '__all__'


class GermplasmResourceSerializer(serializers.ModelSerializer):
    variety_name = serializers.CharField(source='variety.name', read_only=True)
    variety_code = serializers.CharField(source='variety.variety_code', read_only=True)

    class Meta:
        model = GermplasmResource
        fields = '__all__'


class GeneticDiversityAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneticDiversityAnalysis
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


class NutritionDataSerializer(serializers.ModelSerializer):
    variety_name = serializers.CharField(source='variety.name', read_only=True)
    region_name = serializers.CharField(source='variety.region.name', read_only=True)

    class Meta:
        model = NutritionData
        fields = '__all__'


class EventRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventRegistration
        fields = '__all__'
        read_only_fields = ['status', 'create_time', 'update_time']

    def validate_participant_count(self, value):
        if value < 1:
            raise serializers.ValidationError("参会人数至少为 1 人。")
        if value > 20:
            raise serializers.ValidationError("单次登记人数不能超过 20 人。")
        return value

    def validate(self, attrs):
        required_fields = ["event_id", "event_title", "name", "institution", "email"]
        for field in required_fields:
            if not str(attrs.get(field, "")).strip():
                raise serializers.ValidationError({field: "该字段不能为空。"})
        return attrs


