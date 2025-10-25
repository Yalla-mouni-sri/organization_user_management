from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User as DjangoUser
from .models import Organization, User, OrganizationUser

class OrganizationSerializer(serializers.ModelSerializer):
    users_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Organization
        fields = ['id', 'name', 'address', 'created_at', 'updated_at', 'users_count']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_users_count(self, obj):
        return obj.users.count()

class UserSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'organization', 'organization_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class OrganizationDetailSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True, read_only=True)
    
    class Meta:
        model = Organization
        fields = ['id', 'name', 'address', 'users', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class OrganizationUserSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    username = serializers.CharField(source='user.username')
    email = serializers.CharField(source='user.email')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = OrganizationUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'position', 'organization', 'organization_name', 'password', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user_data = validated_data.pop('user', {})
        
        user = DjangoUser.objects.create_user(password=password, **user_data)
        organization_user = OrganizationUser.objects.create(user=user, **validated_data)
        return organization_user

class OrganizationUserReadSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    
    class Meta:
        model = OrganizationUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'position', 'organization', 'organization_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class OrganizationUserCreateUpdateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.CharField(source='user.email')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = OrganizationUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'position', 'organization', 'password']
        read_only_fields = ['id']
    
    def create(self, validated_data):
        password = validated_data.pop('password', 'defaultpassword123')
        user_data = validated_data.pop('user', {})
        
        user = DjangoUser.objects.create_user(password=password, **user_data)
        organization_user = OrganizationUser.objects.create(user=user, **validated_data)
        return organization_user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user_data = validated_data.pop('user', {})
        
        # Update Django user
        user = instance.user
        for attr, value in user_data.items():
            setattr(user, attr, value)
        if password:
            user.set_password(password)
        user.save()
        
        # Update OrganizationUser
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance

class OrganizationSignupSerializer(serializers.Serializer):
    organization_name = serializers.CharField(max_length=200)
    organization_email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=20)
    password = serializers.CharField(min_length=8)
    
    def create(self, validated_data):
        # Create the organization first
        organization = Organization.objects.create(
            name=validated_data['organization_name'],
            address='Address will be updated later'  # Default address
        )
        
        # Create the Django user
        username = validated_data['organization_name'].lower().replace(' ', '_')
        user = DjangoUser.objects.create_user(
            username=username,
            email=validated_data['organization_email'],
            password=validated_data['password'],
            first_name='Admin',
            last_name='User'
        )
        
        # Create the organization user profile
        organization_user = OrganizationUser.objects.create(
            user=user,
            organization=organization,
            phone_number=validated_data['phone_number'],
            position='Administrator'
        )
        
        return organization_user

class UserRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    password = serializers.CharField(min_length=8)
    organization = serializers.IntegerField()
    phone_number = serializers.CharField(max_length=20, required=False, allow_blank=True)
    position = serializers.CharField(max_length=100, required=False, allow_blank=True)
    
    def validate_organization(self, value):
        try:
            Organization.objects.get(id=value)
        except Organization.DoesNotExist:
            raise serializers.ValidationError('Organization does not exist.')
        return value
    
    def validate_username(self, value):
        if DjangoUser.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already exists.')
        return value
    
    def validate_email(self, value):
        if DjangoUser.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email already exists.')
        return value
    
    def create(self, validated_data):
        organization_id = validated_data.pop('organization')
        organization = Organization.objects.get(id=organization_id)
        password = validated_data.pop('password')
        phone_number = validated_data.pop('phone_number', '')
        position = validated_data.pop('position', '')
        
        # Create Django user
        user = DjangoUser.objects.create_user(
            password=password,
            **validated_data
        )
        
        # Create organization user profile
        organization_user = OrganizationUser.objects.create(
            user=user,
            organization=organization,
            phone_number=phone_number,
            position=position
        )
        
        return organization_user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                else:
                    raise serializers.ValidationError('User account is disabled.')
            else:
                raise serializers.ValidationError('Unable to log in with provided credentials.')
        else:
            raise serializers.ValidationError('Must include username and password.')
        
        return data
