from django.db import models
from django.core.validators import EmailValidator
from django.contrib.auth.models import User

class Organization(models.Model):
    name = models.CharField(max_length=200, unique=True)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class OrganizationUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='organization_profile')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='organization_users')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['user__username']

    def __str__(self):
        return f"{self.user.username} ({self.organization.name})"

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, validators=[EmailValidator()])
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='users')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.email})"
