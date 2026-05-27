import csv
import re

from django.http import HttpResponse
from django.db.models import Avg, Count, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from .models import *
from .serializers import *
from rest_framework import serializers

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

class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = '__all__'

class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'

def _safe_download_name(name, extension):
    base = re.sub(r"[^A-Za-z0-9._-]+", "_", name or "dataset").strip("._")
    ext = re.sub(r"[^A-Za-z0-9]+", "", extension or "txt").lower() or "txt"
    return f"{base}.{ext}"

def _build_fake_file(file):
    lines = [
        f"# {file.title}",
        f"format: {file.format or 'txt'}",
        f"size: {file.size or 0}",
        f"version: {file.version or 'v1.0'}",
        f"downloads: {file.downloads}",
        "",
        file.description or "This is a placeholder download generated from the database record.",
        "",
        "record_id,name,value",
        f"{file.id},{file.title},placeholder",
    ]
    return "\n".join(lines) + "\n"

def _int_param(request, name, default, minimum=0, maximum=500):
    try:
        value = int(request.query_params.get(name, default))
    except (TypeError, ValueError):
        value = default
    return max(minimum, min(value, maximum))

def _paginated_response(request, queryset, serializer_class, default_limit=None):
    limit_value = request.query_params.get('limit')
    offset_value = request.query_params.get('offset')
    if limit_value is None and offset_value is None and default_limit is None:
        return Response(serializer_class(queryset, many=True).data)

    limit = _int_param(request, 'limit', default_limit or 100, minimum=1, maximum=500)
    offset = _int_param(request, 'offset', 0, minimum=0, maximum=1000000)
    total = queryset.count()
    rows = queryset[offset:offset + limit]
    return Response({
        'count': total,
        'limit': limit,
        'offset': offset,
        'results': serializer_class(rows, many=True).data,
    })

class DownloadFilesView(APIView):
    def get(self, request, format=None):
        download_files = DownloadFile.objects.all()
        serializer = DownloadFileSerializer(download_files, many=True)
        return Response(serializer.data)

class NewsView(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request, format=None):
        news = News.objects.all()
        serializer = NewsSerializer(news, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = NewsSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ScrollingNewsView(APIView):
    def get(self, request, format=None):
        news = News.objects.filter(is_scrolling=True)
        serializer = NewsSerializer(news, many=True, context={'request': request})
        return Response(serializer.data)

class NewsDetailView(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request, pk, format=None):
        try:
            news = News.objects.get (pk=pk)
            serializer = NewsSerializer(news, context={'request': request})
            return Response(serializer.data)
        except News.DoesNotExist:
            return Response({"error": "News not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk, format=None):
        try:
            news = News.objects.get(pk=pk)
            serializer = NewsSerializer(news, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except News.DoesNotExist:
            return Response({"error": "News not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk, format=None):
        try:
            news = News.objects.get(pk=pk)
            news.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except News.DoesNotExist:
            return Response({"error": "News not found"}, status=status.HTTP_404_NOT_FOUND)

class ChangelogView(APIView):
    def get(self, request, format=None):
        changelog = Changelog.objects.all()
        serializer = ChangelogSerializer(changelog, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        serializer = ChangelogSerializer(data=request.data)
        print(serializer.initial_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangelogDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            changelog = Changelog.objects.get(pk=pk)
            serializer = ChangelogSerializer(changelog)
            return Response(serializer.data)
        except Changelog.DoesNotExist:
            return Response({"error": "Changelog not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk, format=None):
        try:
            changelog = Changelog.objects.get(pk=pk)
            serializer = ChangelogSerializer(changelog, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Changelog.DoesNotExist:
            return Response({"error": "Changelog not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk, format=None):
        try:
            changelog = Changelog.objects.get(pk=pk)
            changelog.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Changelog.DoesNotExist:
            return Response({"error": "Changelog not found"}, status=status.HTTP_404_NOT_FOUND)

class RegionView(APIView):
    def get(self, request, format=None):
        regions = Region.objects.all()
        return _paginated_response(request, regions, RegionSerializer)
    
    def post(self, request, format=None):
        serializer = RegionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegionDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            region = Region.objects.get(pk=pk)
            serializer = RegionSerializer(region)
            return Response(serializer.data)
        except Region.DoesNotExist:
            return Response({"error": "Region not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk, format=None):
        try:
            region = Region.objects.get(pk=pk)
            serializer = RegionSerializer(region, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Region.DoesNotExist:
            return Response({"error": "Region not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk, format=None):
        try:
            region = Region.objects.get(pk=pk)
            region.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Region.DoesNotExist:
            return Response({"error": "Region not found"}, status=status.HTTP_404_NOT_FOUND)

class VarietyView(APIView):
    def get(self, request, format=None):
        varieties = Variety.objects.all()
        serializer = VarietySerializer(varieties, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        serializer = VarietySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VarietyDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            variety = Variety.objects.get(pk=pk)
            serializer = VarietySerializer(variety)
            return Response(serializer.data)
        except Variety.DoesNotExist:
            return Response({"error": "Variety not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk, format=None):
        try:
            variety = Variety.objects.get(pk=pk)
            serializer = VarietySerializer(variety, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Variety.DoesNotExist:
            return Response({"error": "Variety not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk, format=None):
        try:
            variety = Variety.objects.get(pk=pk)
            variety.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Variety.DoesNotExist:
            return Response({"error": "Variety not found"}, status=status.HTTP_404_NOT_FOUND)

class GeneView(APIView):
    def get(self, request, format=None):
        genes = Gene.objects.all()
        serializer = GeneSerializer(genes, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        serializer = GeneSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GeneDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            gene = Gene.objects.get(pk=pk)
            serializer = GeneSerializer(gene)
            return Response(serializer.data)
        except Gene.DoesNotExist:
            return Response({"error": "Gene not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk, format=None):
        try:
            gene = Gene.objects.get(pk=pk)
            serializer = GeneSerializer(gene, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Gene.DoesNotExist:
            return Response({"error": "Gene not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk, format=None):
        try:
            gene = Gene.objects.get(pk=pk)
            gene.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Gene.DoesNotExist:
            return Response({"error": "Gene not found"}, status=status.HTTP_404_NOT_FOUND)


class GeneExpressionView(APIView):
    def get(self, request, format=None):
        gene_expressions = GeneExpression.objects.all()
        serializer = GeneExpressionSerializer(gene_expressions, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        serializer = GeneExpressionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GeneExpressionDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            gene_expr = GeneExpression.objects.get(pk=pk)
            serializer = GeneExpressionSerializer(gene_expr)
            return Response(serializer.data)
        except GeneExpression.DoesNotExist:
            return Response({"error": "GeneExpression not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk, format=None):
        try:
            gene_expr = GeneExpression.objects.get(pk=pk)
            serializer = GeneExpressionSerializer(gene_expr, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except GeneExpression.DoesNotExist:
            return Response({"error": "GeneExpression not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk, format=None):
        try:
            gene_expr = GeneExpression.objects.get(pk=pk)
            gene_expr.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except GeneExpression.DoesNotExist:
            return Response({"error": "GeneExpression not found"}, status=status.HTTP_404_NOT_FOUND)


class EnvironmentalFactorView(APIView):
    def get(self, request, format=None):
        factors = EnvironmentalFactor.objects.all()
        serializer = EnvironmentalFactorSerializer(factors, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        serializer = EnvironmentalFactorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EnvironmentalFactorDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            factor = EnvironmentalFactor.objects.get(pk=pk)
            serializer = EnvironmentalFactorSerializer(factor)
            return Response(serializer.data)
        except EnvironmentalFactor.DoesNotExist:
            return Response({"error": "EnvironmentalFactor not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk, format=None):
        try:
            factor = EnvironmentalFactor.objects.get(pk=pk)
            serializer = EnvironmentalFactorSerializer(factor, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except EnvironmentalFactor.DoesNotExist:
            return Response({"error": "EnvironmentalFactor not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk, format=None):
        try:
            factor = EnvironmentalFactor.objects.get(pk=pk)
            factor.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except EnvironmentalFactor.DoesNotExist:
            return Response({"error": "EnvironmentalFactor not found"}, status=status.HTTP_404_NOT_FOUND)


class NutritionView(APIView):
    def get(self, request, format=None):
        nutrition = Nutrition.objects.all()
        serializer = NutritionSerializer(nutrition, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        serializer = NutritionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NutritionDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            nutrition = Nutrition.objects.get(pk=pk)
            serializer = NutritionSerializer(nutrition)
            return Response(serializer.data)
        except Nutrition.DoesNotExist:
            return Response({"error": "Nutrition not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk, format=None):
        try:
            nutrition = Nutrition.objects.get(pk=pk)
            serializer = NutritionSerializer(nutrition, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Nutrition.DoesNotExist:
            return Response({"error": "Nutrition not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk, format=None):
        try:
            nutrition = Nutrition.objects.get(pk=pk)
            nutrition.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Nutrition.DoesNotExist:
            return Response({"error": "Nutrition not found"}, status=status.HTTP_404_NOT_FOUND)


class DownloadFileView(APIView):
    def get(self, request, format=None):
        files = DownloadFile.objects.all()
        serializer = DownloadFileSerializer(files, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        serializer = DownloadFileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DownloadFileDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            file = DownloadFile.objects.get(pk=pk)
            serializer = DownloadFileSerializer(file)
            return Response(serializer.data)
        except DownloadFile.DoesNotExist:
            return Response({"error": "DownloadFile not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk, format=None):
        try:
            file = DownloadFile.objects.get(pk=pk)
            serializer = DownloadFileSerializer(file, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except DownloadFile.DoesNotExist:
            return Response({"error": "DownloadFile not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk, format=None):
        try:
            file = DownloadFile.objects.get(pk=pk)
            file.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except DownloadFile.DoesNotExist:
            return Response({"error": "DownloadFile not found"}, status=status.HTTP_404_NOT_FOUND)

class DownloadFileDownloadView(APIView):
    def get(self, request, pk, format=None):
        try:
            file = DownloadFile.objects.get(pk=pk)
        except DownloadFile.DoesNotExist:
            return Response({"error": "DownloadFile not found"}, status=status.HTTP_404_NOT_FOUND)

        file.downloads = (file.downloads or 0) + 1
        file.save(update_fields=["downloads", "update_time"])
        filename = _safe_download_name(file.title, file.format)
        response = HttpResponse(_build_fake_file(file), content_type="application/octet-stream")
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response


class InstitutionView(APIView):
    def get(self, request, format=None):
        institutions = Institution.objects.all()
        return _paginated_response(request, institutions, InstitutionSerializer)
    
    def post(self, request, format=None):
        serializer = InstitutionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InstitutionDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            institution = Institution.objects.get(pk=pk)
            serializer = InstitutionSerializer(institution)
            return Response(serializer.data)
        except Institution.DoesNotExist:
            return Response({"error": "Institution not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk, format=None):
        try:
            institution = Institution.objects.get(pk=pk)
            serializer = InstitutionSerializer(institution, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Institution.DoesNotExist:
            return Response({"error": "Institution not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk, format=None):
        try:
            institution = Institution.objects.get(pk=pk)
            institution.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Institution.DoesNotExist:
            return Response({"error": "Institution not found"}, status=status.HTTP_404_NOT_FOUND)

class AnnouncementView(APIView):
    def get(self, request, format=None):
        announcements = Announcement.objects.all()
        serializer = AnnouncementSerializer(announcements, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        serializer = AnnouncementSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AnnouncementDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            announcement = Announcement.objects.get(pk=pk)
            serializer = AnnouncementSerializer(announcement)
            return Response(serializer.data)
        except Announcement.DoesNotExist:
            return Response({"error": "Announcement not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk, format=None):
        try:
            announcement = Announcement.objects.get(pk=pk)
            serializer = AnnouncementSerializer(announcement, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Announcement.DoesNotExist:
            return Response({"error": "Announcement not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk, format=None):
        try:
            announcement = Announcement.objects.get(pk=pk)
            announcement.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Announcement.DoesNotExist:
            return Response({"error": "Announcement not found"}, status=status.HTTP_404_NOT_FOUND)


class NutritionDataView(APIView):
    def get(self, request, format=None):
        records = NutritionData.objects.select_related('variety', 'variety__region').all()
        q = request.query_params.get('q')
        if q:
            records = records.filter(Q(sample_code__icontains=q) | Q(variety__name__icontains=q) | Q(variety__variety_code__icontains=q) | Q(variety__region__name__icontains=q) | Q(variety__region__country__icontains=q))
        region = request.query_params.get('region')
        if region:
            records = records.filter(variety__region_id=region)
        order = request.query_params.get('ordering')
        if order in {'oil_content', '-oil_content', 'protein', '-protein', 'fatty_acid', '-fatty_acid', 'lignan', '-lignan', 'sample_code', '-sample_code'}:
            records = records.order_by(order)
        return _paginated_response(request, records, NutritionDataSerializer, default_limit=100)

    def post(self, request, format=None):
        serializer = NutritionDataSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NutritionDataDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            record = NutritionData.objects.get(pk=pk)
            return Response(NutritionDataSerializer(record).data)
        except NutritionData.DoesNotExist:
            return Response({'error': 'Nutrition data not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk, format=None):
        try:
            record = NutritionData.objects.get(pk=pk)
            serializer = NutritionDataSerializer(record, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except NutritionData.DoesNotExist:
            return Response({'error': 'Nutrition data not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk, format=None):
        try:
            NutritionData.objects.get(pk=pk).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except NutritionData.DoesNotExist:
            return Response({'error': 'Nutrition data not found'}, status=status.HTTP_404_NOT_FOUND)

class GlobalSearchView(APIView):
    def get(self, request, format=None):
        q = request.query_params.get('q', '').strip()
        if not q:
            return Response({'query': q, 'regions': [], 'varieties': [], 'genes': [], 'nutrition': []})
        regions = Region.objects.filter(Q(name__icontains=q) | Q(code__icontains=q) | Q(country__icontains=q))[:20]
        varieties = Variety.objects.filter(Q(name__icontains=q) | Q(variety_code__icontains=q) | Q(seed_color__icontains=q))[:20]
        genes = Gene.objects.filter(Q(gene_id__icontains=q) | Q(name__icontains=q) | Q(function__icontains=q) | Q(pathway__icontains=q))[:20]
        nutrition = NutritionData.objects.select_related('variety').filter(Q(sample_code__icontains=q) | Q(variety__name__icontains=q))[:20]
        return Response({
            'query': q,
            'regions': RegionSerializer(regions, many=True).data,
            'varieties': VarietySerializer(varieties, many=True).data,
            'genes': GeneSerializer(genes, many=True).data,
            'nutrition': NutritionDataSerializer(nutrition, many=True).data,
        })

SUNFLOWER_REGION_COORDS = {
    'IM': (111.76, 40.82),
    'NMG': (111.76, 40.82),
    'XJ': (87.62, 43.82),
    'HLJ': (126.64, 45.76),
    'JL': (125.32, 43.90),
    'LN': (123.43, 41.80),
    'GS': (103.83, 36.06),
    'NX': (106.23, 38.49),
    'HB': (114.52, 38.04),
    'SD': (117.12, 36.65),
}

SUNFLOWER_DEMO_REGIONS = [
    {'name': 'Inner Mongolia Hetao Trial Zone', 'code': 'IM', 'country': 'China', 'climate': 'temperate semi-arid', 'variety_count': 18, 'avg_oil': 48.6, 'lat': 40.82, 'lng': 111.76},
    {'name': 'Xinjiang Irrigated Oasis Panel', 'code': 'XJ', 'country': 'China', 'climate': 'continental arid', 'variety_count': 16, 'avg_oil': 47.9, 'lat': 43.82, 'lng': 87.62},
    {'name': 'Heilongjiang Cool Region Nursery', 'code': 'HLJ', 'country': 'China', 'climate': 'cool temperate', 'variety_count': 12, 'avg_oil': 44.8, 'lat': 45.76, 'lng': 126.64},
    {'name': 'Jilin Disease Resistance Nursery', 'code': 'JL', 'country': 'China', 'climate': 'temperate monsoon', 'variety_count': 10, 'avg_oil': 45.2, 'lat': 43.90, 'lng': 125.32},
    {'name': 'Gansu Dryland Evaluation Site', 'code': 'GS', 'country': 'China', 'climate': 'dry plateau', 'variety_count': 9, 'avg_oil': 46.1, 'lat': 36.06, 'lng': 103.83},
    {'name': 'Ningxia Salinity Screening Site', 'code': 'NX', 'country': 'China', 'climate': 'semi-arid irrigated', 'variety_count': 8, 'avg_oil': 45.7, 'lat': 38.49, 'lng': 106.23},
    {'name': 'Hebei Adaptation Nursery', 'code': 'HB', 'country': 'China', 'climate': 'warm temperate', 'variety_count': 7, 'avg_oil': 44.4, 'lat': 38.04, 'lng': 114.52},
    {'name': 'Shandong Quality Verification Site', 'code': 'SD', 'country': 'China', 'climate': 'warm temperate monsoon', 'variety_count': 6, 'avg_oil': 43.8, 'lat': 36.65, 'lng': 117.12},
]

SUNFLOWER_GENE_ROWS = [
    ('HaFAD2-1', 'oleic acid desaturation', [18, 32, 54, 68, 81, 74]),
    ('HaFAD3', 'linolenic acid synthesis', [12, 20, 35, 47, 62, 58]),
    ('HaDGAT1', 'triacylglycerol assembly', [22, 38, 59, 76, 88, 83]),
    ('HaWRI1', 'oil biosynthesis regulator', [28, 44, 61, 73, 69, 52]),
    ('HaOLE1', 'oil body formation', [8, 16, 42, 66, 91, 87]),
    ('HaSAD6', 'stearoyl-ACP desaturase', [26, 41, 64, 79, 72, 55]),
    ('HaNAC29', 'salt tolerance response', [11, 23, 39, 57, 68, 70]),
    ('HaWRKY33', 'broomrape defense', [9, 18, 31, 49, 63, 76]),
    ('HaHKT1', 'ion transport', [15, 26, 34, 52, 67, 72]),
    ('HaCYP707A', 'stress hormone turnover', [7, 14, 28, 44, 59, 66]),
    ('HaLEA14', 'seed dehydration tolerance', [5, 12, 33, 58, 79, 85]),
    ('HaMYB96', 'cuticle and drought response', [13, 25, 43, 60, 71, 64]),
]

SUNFLOWER_PROTEIN_EDGES = [
    ('HaWRI1', 'HaDGAT1', 0.92), ('HaWRI1', 'HaFAD2-1', 0.74), ('HaDGAT1', 'HaOLE1', 0.88),
    ('HaFAD2-1', 'HaFAD3', 0.81), ('HaSAD6', 'HaFAD2-1', 0.77), ('HaNAC29', 'HaHKT1', 0.84),
    ('HaWRKY33', 'HaCYP707A', 0.69), ('HaMYB96', 'HaLEA14', 0.73), ('HaNAC29', 'HaMYB96', 0.66),
    ('HaWRI1', 'HaSAD6', 0.71), ('HaDGAT1', 'HaFAD3', 0.58), ('HaWRKY33', 'HaNAC29', 0.62),
]

def _region_coordinates(region):
    code = (region.code or '').upper()
    for key, coords in SUNFLOWER_REGION_COORDS.items():
        if key in code:
            return coords
    return (103.8, 36.5)

def _demo_gene_expression():
    tissues = ['Root', 'Leaf', 'Bud', 'Flower', 'Early seed', 'Mature seed']
    matrix = [
        {'gene': gene, 'function': function, 'values': [{'tissue': tissue, 'value': value} for tissue, value in zip(tissues, values)]}
        for gene, function, values in SUNFLOWER_GENE_ROWS
    ]
    flat = [
        {'id': f'{gene}-{item["tissue"]}', 'gene_id': gene, 'gene_name': function, 'tissue': item['tissue'], 'stage': item['tissue'], 'expression_value': item['value'], 'tpm': item['value']}
        for gene, function, values in SUNFLOWER_GENE_ROWS
        for item in [{'tissue': tissue, 'value': value} for tissue, value in zip(tissues, values)]
    ]
    return tissues, matrix, flat

def _demo_protein_network():
    genes = [row[0] for row in SUNFLOWER_GENE_ROWS[:10]]
    nodes = [
        {
            'id': gene,
            'label': gene,
            'group': 'Oil quality' if index < 5 else 'Stress response',
            'score': 90 - index * 4,
        }
        for index, gene in enumerate(genes)
    ]
    edges = [{'source': source, 'target': target, 'weight': weight} for source, target, weight in SUNFLOWER_PROTEIN_EDGES]
    return nodes, edges

class VisualizationSummaryView(APIView):
    def get(self, request, format=None):
        sample_limit = _int_param(request, 'limit', 80, minimum=1, maximum=200)
        nutrition = NutritionData.objects.select_related('variety', 'variety__region')[:sample_limit]
        expressions = GeneExpression.objects.select_related('gene', 'variety')[:sample_limit]
        region_rows = [
            {
                'id': region.id,
                'name': region.name,
                'code': region.code,
                'country': region.country,
                'climate': region.climate,
                'variety_count': region.variety_count,
                'avg_oil': round(float(region.avg_oil or 0), 2),
                'lng': _region_coordinates(region)[0],
                'lat': _region_coordinates(region)[1],
            }
            for region in Region.objects.annotate(
                variety_count=Count('varieties'),
                avg_oil=Avg('varieties__oil_content'),
            )[:sample_limit]
        ]
        if len(region_rows) < 6:
            existing_codes = {row.get('code') for row in region_rows}
            region_rows.extend([row for row in SUNFLOWER_DEMO_REGIONS if row['code'] not in existing_codes])

        tissues, expression_matrix, demo_expression = _demo_gene_expression()
        expression_rows = GeneExpressionSerializer(expressions, many=True).data
        if len(expression_rows) < 36:
            expression_rows = expression_rows + demo_expression

        protein_nodes, protein_edges = _demo_protein_network()
        db_edges = [
            {'source': gene.gene_id, 'target': gene.pathway or gene.gene_type or 'trait', 'weight': index + 1}
            for index, gene in enumerate(Gene.objects.exclude(pathway__isnull=True)[:20])
        ]
        return Response({
            'counts': {
                'nutrition': NutritionData.objects.count(),
                'regions': Region.objects.count(),
                'varieties': Variety.objects.count(),
                'genes': Gene.objects.count(),
                'gene_expression': GeneExpression.objects.count(),
                'institutions': Institution.objects.count(),
            },
            'nutrition': NutritionDataSerializer(nutrition, many=True).data,
            'gene_expression': expression_rows[:max(sample_limit, 72)],
            'expression_tissues': tissues,
            'expression_matrix': expression_matrix,
            'regions': region_rows,
            'region_map': region_rows[:12],
            'network': db_edges or protein_edges,
            'protein_nodes': protein_nodes,
            'protein_edges': protein_edges,  
        })

class DataExportView(APIView):
    def get(self, request, entity, format=None):
        exporters = {
            'regions': (Region.objects.all(), ['id', 'name', 'code', 'country', 'climate']),
            'varieties': (Variety.objects.select_related('region').all(), ['id', 'name', 'variety_code', 'seed_color', 'oil_content', 'maturity_days', 'yield_per_hectare']),
            'genes': (Gene.objects.all(), ['id', 'gene_id', 'name', 'symbol', 'chromosome', 'gene_type', 'pathway']),
            'nutrition': (NutritionData.objects.select_related('variety').all(), ['id', 'sample_code', 'variety_name', 'oil_content', 'protein', 'fatty_acid', 'lignan', 'method', 'test_date']),
        }
        if entity not in exporters:
            return Response({'error': 'Unsupported export entity'}, status=status.HTTP_404_NOT_FOUND)
        rows, fields = exporters[entity]
        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="{entity}.csv"'
        response.write('\ufeff')
        writer = csv.writer(response)
        writer.writerow(fields)
        for row in rows:
            values = []
            for field in fields:
                values.append(getattr(row.variety, 'name', '') if field == 'variety_name' else getattr(row, field, ''))
            writer.writerow(values)
        return response
