from django.contrib import admin
from .models import Organization, User

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ['name', 'address', 'created_at']
    search_fields = ['name', 'address']
    list_filter = ['created_at']

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'organization', 'created_at']
    search_fields = ['name', 'email', 'organization__name']
    list_filter = ['organization', 'created_at']
