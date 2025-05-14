from django.shortcuts import render
from django.db.models import Count, Sum
from rest_framework import viewsets, generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    ApprovalStatus, Fund, Country, LeadOrgUnit,
    Theme, Donor, Project, ProjectDonor
)
from .serializers import (
    ApprovalStatusSerializer, FundSerializer, CountrySerializer,
    LeadOrgUnitSerializer, ThemeSerializer, DonorSerializer,
    ProjectListSerializer, ProjectDetailSerializer
)

class ProjectViewSet(viewsets.ModelViewSet):
    """
    API endpoint for CRUD operations on projects
    """
    queryset = Project.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectDetailSerializer

class AllProjectsAPIView(generics.ListAPIView):
    """
    API endpoint that returns all projects
    """
    queryset = Project.objects.all()
    serializer_class = ProjectListSerializer

class ProjectsByCountryAPIView(generics.ListAPIView):
    """
    API endpoint that returns projects by country
    """
    serializer_class = ProjectListSerializer

    def get_queryset(self):
        country_name = self.kwargs.get('country_name')
        return Project.objects.filter(country__country_name__iexact=country_name)

class ProjectsByApprovalStatusAPIView(generics.ListAPIView):
    """
    API endpoint that returns projects by approval status
    """
    serializer_class = ProjectListSerializer

    def get_queryset(self):
        status_name = self.kwargs.get('status_name')
        return Project.objects.filter(approval_status__status_name__iexact=status_name)

class DashboardDataAPIView(APIView):
    """
    API endpoint that returns dashboard data
    """
    def get(self, request, format=None):
        # Projects by country
        country_data = Project.objects.values('country__country_name').annotate(
            count=Count('project_id'),
            total_value=Sum('pag_value')
        ).order_by('-count')

        # Projects by lead org unit
        org_unit_data = Project.objects.values('lead_org_unit__org_unit_name').annotate(
            count=Count('project_id'),
            total_value=Sum('pag_value')
        ).order_by('-count')

        # Projects by theme
        theme_data = Project.objects.values('theme__theme_name').annotate(
            count=Count('project_id'),
            total_value=Sum('pag_value')
        ).order_by('-count')

        return Response({
            'by_country': country_data,
            'by_org_unit': org_unit_data,
            'by_theme': theme_data
        })
