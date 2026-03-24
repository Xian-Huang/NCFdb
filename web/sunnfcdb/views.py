from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import DownloadFileSerializer, NewsSerializer, ChangelogSerializer
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

class DownloadFilesView(APIView):
    def get(self, request, format=None):
        download_files = DownloadFile.objects.all()
        serializer = DownloadFileSerializer(download_files, many=True)
        return Response(serializer.data)

class NewsView(APIView):
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

class NewsDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            news = News.objects.get(pk=pk)
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

class RegionView(APIView):
    def get(self, request, format=None):
        regions = Region.objects.all()
        serializer = RegionSerializer(regions, many=True)
        return Response(serializer.data)
    
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


class InstitutionView(APIView):
    def get(self, request, format=None):
        institutions = Institution.objects.all()
        serializer = InstitutionSerializer(institutions, many=True)
        return Response(serializer.data)
    
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

        if request.user.is_authenticated:
            return Response(UserSerializer(request.user).data)
        return Response({"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
