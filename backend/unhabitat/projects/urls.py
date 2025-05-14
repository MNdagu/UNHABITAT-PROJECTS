from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet, AllProjectsAPIView, 
    ProjectsByCountryAPIView, ProjectsByApprovalStatusAPIView,
    DashboardDataAPIView
)

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api/projects/all/', AllProjectsAPIView.as_view(), name='all-projects'),
    path('api/projects/country/<str:country_name>/', ProjectsByCountryAPIView.as_view(), name='projects-by-country'),
    path('api/projects/approval-status/<str:status_name>/', ProjectsByApprovalStatusAPIView.as_view(), name='projects-by-status'),
    path('api/dashboard/', DashboardDataAPIView.as_view(), name='dashboard-data'),
]
