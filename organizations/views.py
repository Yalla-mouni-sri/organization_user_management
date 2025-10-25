from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token as AuthToken
from django.contrib.auth import login, logout
from django.shortcuts import get_object_or_404
from .models import Organization, User, OrganizationUser
from .serializers import OrganizationSerializer, UserSerializer, OrganizationDetailSerializer, OrganizationUserSerializer, OrganizationUserReadSerializer, OrganizationUserCreateUpdateSerializer, OrganizationSignupSerializer, LoginSerializer, UserRegistrationSerializer

class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return OrganizationDetailSerializer
        return OrganizationSerializer

    @action(detail=True, methods=['get'])
    def users(self, request, pk=None):
        organization = self.get_object()
        users = organization.organization_users.all()
        serializer = OrganizationUserReadSerializer(users, many=True)
        return Response(serializer.data)

class UserViewSet(viewsets.ModelViewSet):
    queryset = OrganizationUser.objects.all()
    serializer_class = OrganizationUserReadSerializer

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return OrganizationUserCreateUpdateSerializer
        return OrganizationUserReadSerializer

    def get_queryset(self):
        queryset = OrganizationUser.objects.all()
        organization_id = self.request.query_params.get('organization', None)
        if organization_id is not None:
            queryset = queryset.filter(organization_id=organization_id)
        return queryset

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """Organization signup endpoint"""
    serializer = OrganizationSignupSerializer(data=request.data)
    if serializer.is_valid():
        organization_user = serializer.save()
        return Response({
            'user': OrganizationUserReadSerializer(organization_user).data,
            'message': 'Organization registered successfully'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Organization login endpoint"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = AuthToken.objects.get_or_create(user=user)
        login(request, user)
        
        # Get the organization user profile
        try:
            org_user = OrganizationUser.objects.get(user=user)
            user_data = OrganizationUserReadSerializer(org_user).data
        except OrganizationUser.DoesNotExist:
            # Fallback if no organization profile exists
            user_data = {
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'organization_name': 'No Organization'
            }
        
        return Response({
            'user': user_data,
            'token': token.key,
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Organization logout endpoint"""
    try:
        request.user.auth_token.delete()
    except:
        pass
    logout(request)
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    """Get current organization user profile"""
    try:
        org_user = OrganizationUser.objects.get(user=request.user)
        serializer = OrganizationUserReadSerializer(org_user)
        return Response(serializer.data)
    except OrganizationUser.DoesNotExist:
        return Response({'error': 'Organization profile not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Update organization user profile"""
    try:
        org_user = OrganizationUser.objects.get(user=request.user)
        serializer = OrganizationUserSerializer(org_user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except OrganizationUser.DoesNotExist:
        return Response({'error': 'Organization profile not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AllowAny])
def user_registration(request):
    """User registration to specific organization endpoint"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        organization_user = serializer.save()
        return Response({
            'user': OrganizationUserReadSerializer(organization_user).data,
            'message': 'User registered successfully to organization'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_organizations_list(request):
    """Get list of all organizations for user registration"""
    organizations = Organization.objects.all()
    serializer = OrganizationSerializer(organizations, many=True)
    return Response(serializer.data)