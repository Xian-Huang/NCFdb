import csv
import re

from django.http import HttpResponse
from django.db.models import Avg, Count, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import DownloadFile, Region, Variety, Gene, GeneExpression, EnvironmentalFactor, RegionalMapSite, RegionalEnvironmentValue, Institution, Announcement, News, Changelog, NutritionData
from .serializers import (
    DownloadFileSerializer, RegionSerializer, VarietySerializer, GeneSerializer, GeneExpressionSerializer,
    EnvironmentalFactorSerializer, RegionalMapSiteSerializer, RegionalEnvironmentValueSerializer, InstitutionSerializer, AnnouncementSerializer,
    NewsSerializer, NewsListSerializer, ChangelogSerializer, NutritionDataSerializer
)

def _safe_download_name(name, extension):
    base = re.sub(r"[^A-Za-z0-9._-]+", "_", name or "dataset").strip("._")
    ext = re.sub(r"[^A-Za-z0-9]+", "", extension or "txt").lower() or "txt"
    return f"{base}.{ext}"

def _build_fake_file(file):
    lines = [
        f"# {file.file_name}",
        f"type: {file.file_type}",
        f"size: {file.file_size}",
        f"category: {file.category}",
        f"version: {file.version or 'v1.0'}",
        "",
        file.description or "This is a placeholder download generated from the database record.",
        "",
        "record_id,name,value",
        f"{file.id},{file.file_name},placeholder",
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

class DownloadFileView(APIView):
    def get(self, request, format=None):
        files = DownloadFile.objects.filter(is_published=True)
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
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk, format=None):
        try:
            file = DownloadFile.objects.get(pk=pk)
            serializer = DownloadFileSerializer(file, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except DownloadFile.DoesNotExist:
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk, format=None):
        try:
            file = DownloadFile.objects.get(pk=pk)
            file.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except DownloadFile.DoesNotExist:
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)

class DownloadFileDownloadView(APIView):
    def get(self, request, pk, format=None):
        try:
            file = DownloadFile.objects.get(pk=pk, is_published=True)
        except DownloadFile.DoesNotExist:
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)

        filename = _safe_download_name(file.file_name, file.file_type)
        response = HttpResponse(_build_fake_file(file), content_type="application/octet-stream")
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response

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
        announcements = Announcement.objects.filter(is_published=True)
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

class NewsView(APIView):
    def get(self, request, format=None):
        news = News.objects.filter(is_published=True)
        serializer = NewsListSerializer(news, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = NewsSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ScrollingNewsView(APIView):
    def get(self, request, format=None):
        news = News.objects.filter(is_published=True, is_scrolling=True)
        serializer = NewsListSerializer(news, many=True, context={'request': request})
        return Response(serializer.data)

class NewsDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            news = News.objects.get(pk=pk, is_published=True)
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
        changelog = Changelog.objects.filter(is_published=True)
        serializer = ChangelogSerializer(changelog, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        serializer = ChangelogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
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


class RegionalMapSiteView(APIView):
    def get(self, request, format=None):
        sites = RegionalMapSite.objects.select_related('region').prefetch_related('varieties', 'environment_values__factor').all()
        region = request.query_params.get('region')
        if region:
            sites = sites.filter(region_id=region)
        active = request.query_params.get('active')
        if active in {'true', '1'}:
            sites = sites.filter(is_active=True)
        return _paginated_response(request, sites, RegionalMapSiteSerializer)

    def post(self, request, format=None):
        serializer = RegionalMapSiteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegionalMapSiteDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            site = RegionalMapSite.objects.prefetch_related('varieties', 'environment_values__factor').get(pk=pk)
            return Response(RegionalMapSiteSerializer(site).data)
        except RegionalMapSite.DoesNotExist:
            return Response({"error": "Regional map site not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk, format=None):
        try:
            site = RegionalMapSite.objects.get(pk=pk)
            serializer = RegionalMapSiteSerializer(site, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except RegionalMapSite.DoesNotExist:
            return Response({"error": "Regional map site not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk, format=None):
        try:
            RegionalMapSite.objects.get(pk=pk).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except RegionalMapSite.DoesNotExist:
            return Response({"error": "Regional map site not found"}, status=status.HTTP_404_NOT_FOUND)


class RegionalEnvironmentValueView(APIView):
    def get(self, request, format=None):
        values = RegionalEnvironmentValue.objects.select_related('site', 'factor').all()
        site = request.query_params.get('site')
        if site:
            values = values.filter(site_id=site)
        return _paginated_response(request, values, RegionalEnvironmentValueSerializer)

    def post(self, request, format=None):
        serializer = RegionalEnvironmentValueSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegionalEnvironmentValueDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            value = RegionalEnvironmentValue.objects.select_related('site', 'factor').get(pk=pk)
            return Response(RegionalEnvironmentValueSerializer(value).data)
        except RegionalEnvironmentValue.DoesNotExist:
            return Response({"error": "Regional environment value not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk, format=None):
        try:
            value = RegionalEnvironmentValue.objects.get(pk=pk)
            serializer = RegionalEnvironmentValueSerializer(value, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except RegionalEnvironmentValue.DoesNotExist:
            return Response({"error": "Regional environment value not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk, format=None):
        try:
            RegionalEnvironmentValue.objects.get(pk=pk).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except RegionalEnvironmentValue.DoesNotExist:
            return Response({"error": "Regional environment value not found"}, status=status.HTTP_404_NOT_FOUND)


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


def _environment_display(value):
    if value.display_value:
        return value.display_value
    unit = value.factor.unit or ''
    if value.value_min is not None and value.value_max is not None:
        return f"{value.value_min:g}-{value.value_max:g} {unit}".strip()
    if value.value_min is not None:
        return f"{value.value_min:g} {unit}".strip()
    if value.value_max is not None:
        return f"{value.value_max:g} {unit}".strip()
    return ''


def _factor_bucket(value):
    text = f"{value.factor.code} {value.factor.name} {value.factor.category}".lower()
    if any(token in text for token in ['temp', 'temperature', '温度', '气温']):
        return 'temperature'
    if any(token in text for token in ['precip', 'rain', '降水', '降雨']):
        return 'precipitation'
    if any(token in text for token in ['sun', 'light', '日照', '光照']):
        return 'sunshine'
    if any(token in text for token in ['soil', '土壤']):
        return 'soil'
    return ''


def _map_site_payload(site):
    varieties = list(site.varieties.all())
    if not varieties:
        varieties = list(site.region.varieties.all()[:5])
    env_values = list(site.environment_values.all())
    env = {}
    for value in env_values:
        bucket = _factor_bucket(value)
        if bucket:
            env[bucket] = _environment_display(value)
    avg_oil_values = [float(variety.oil_content) for variety in varieties if variety.oil_content is not None]
    return {
        'id': site.id,
        'name': site.name,
        'code': site.code,
        'province': site.province,
        'region': site.region.name,
        'region_code': site.region.code,
        'country': site.region.country,
        'climate': site.region.climate,
        'trait': site.trait,
        'component': site.component,
        'soil': env.get('soil') or site.soil,
        'lng': float(site.longitude),
        'lat': float(site.latitude),
        'varieties': [variety.name for variety in varieties],
        'variety_count': len(varieties),
        'avg_oil': round(sum(avg_oil_values) / len(avg_oil_values), 2) if avg_oil_values else 0,
        'temperature': env.get('temperature', ''),
        'precipitation': env.get('precipitation', ''),
        'sunshine': env.get('sunshine', ''),
        'environment_values': RegionalEnvironmentValueSerializer(env_values, many=True).data,
    }

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
            }
            for region in Region.objects.annotate(
                variety_count=Count('varieties'),
                avg_oil=Avg('varieties__oil_content'),
            )[:sample_limit]
        ]
        map_sites = RegionalMapSite.objects.filter(is_active=True).select_related('region').prefetch_related('varieties', 'region__varieties', 'environment_values__factor')[:sample_limit]
        region_map = [_map_site_payload(site) for site in map_sites]
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
            'gene_expression': GeneExpressionSerializer(expressions, many=True).data,
            'regions': region_rows,
            'region_map': region_map,
            'network': [
                {'source': gene.gene_id, 'target': gene.pathway or gene.gene_type or 'trait', 'weight': index + 1}
                for index, gene in enumerate(Gene.objects.exclude(pathway__isnull=True)[:20])
            ],
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
