from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OrganizationViewSet, UserViewSet, 
    signup, login_view, logout_view, 
    profile, update_profile, user_registration, get_organizations_list
)

router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/signup/', signup, name='signup'),
    path('api/auth/login/', login_view, name='login'),
    path('api/auth/logout/', logout_view, name='logout'),
    path('api/auth/profile/', profile, name='profile'),
    path('api/auth/update-profile/', update_profile, name='update_profile'),
    path('api/auth/user-registration/', user_registration, name='user_registration'),
    path('api/organizations-list/', get_organizations_list, name='organizations_list'),
]
