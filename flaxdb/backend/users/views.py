from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication
from .serializers import UserSerializer, UserCreateSerializer
import secrets

def _int_param(request, name, default, minimum=0, maximum=500):
    try:
        value = int(request.query_params.get(name, default))
    except (TypeError, ValueError):
        value = default
    return max(minimum, min(value, maximum))

def _user_list_response(request, queryset):
    search = (request.query_params.get('search') or '').strip()
    if search:
        queryset = queryset.filter(username__icontains=search) | queryset.filter(email__icontains=search) | queryset.filter(first_name__icontains=search) | queryset.filter(last_name__icontains=search)
        queryset = queryset.distinct()

    page_value = request.query_params.get('page')
    page_size_value = request.query_params.get('page_size')
    if page_value is None and page_size_value is None:
        return Response(UserSerializer(queryset, many=True).data)

    page = _int_param(request, 'page', 1, minimum=1, maximum=1000000)
    page_size = _int_param(request, 'page_size', 20, minimum=1, maximum=500)
    total = queryset.count()
    offset = (page - 1) * page_size
    rows = queryset[offset:offset + page_size]
    return Response({
        'count': total,
        'page': page,
        'page_size': page_size,
        'results': UserSerializer(rows, many=True).data,
    })

class UserListView(APIView):
    def get(self, request, format=None):
        users = User.objects.all().order_by('id')
        return _user_list_response(request, users)
    
    def post(self, request, format=None):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(APIView):
    def get(self, request, pk, format=None):
        try:
            user = User.objects.get(pk=pk)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk, format=None):
        try:
            user = User.objects.get(pk=pk)
            data = request.data
            user.username = data.get('username', user.username)
            user.email = data.get('email', user.email)
            user.first_name = data.get('first_name', user.first_name)
            user.last_name = data.get('last_name', user.last_name)
            user.is_active = data.get('is_active', user.is_active)
            user.is_staff = data.get('is_staff', user.is_staff)
            if 'password' in data and data['password']:
                user.set_password(data['password'])
            user.save()
            return Response(UserSerializer(user).data)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk, format=None):
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class LoginView(APIView):
    authentication_classes = [TokenAuthentication]  
    permission_classes = [AllowAny]
    
    def post(self, request, format=None):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            token = secrets.token_hex(16)
            print("success login:", username)
            return Response({
                "message": "Login successful",
                "user": UserSerializer(user).data,
                "token": token
            })
        else:
            print("login failed:", username)
            return Response(
                {"error": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )


class LogoutView(APIView):
    def post(self, request, format=None):
        logout(request)
        return Response({"message": "Logout successful"})


class CurrentUserView(APIView):
    def get(self, request, format=None):
        if request.user.is_authenticated:
            return Response(UserSerializer(request.user).data)
        return Response({"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
