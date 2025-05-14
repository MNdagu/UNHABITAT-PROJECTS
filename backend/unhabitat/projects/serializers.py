from rest_framework import serializers
from .models import (
    ApprovalStatus, Fund, Country, LeadOrgUnit, 
    Theme, Donor, Project, ProjectDonor
)

class ApprovalStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApprovalStatus
        fields = ['id', 'status_name']

class FundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fund
        fields = ['id', 'fund_code']

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'country_name']

class LeadOrgUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadOrgUnit
        fields = ['id', 'org_unit_name']

class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = ['id', 'theme_name']

class DonorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donor
        fields = ['id', 'donor_name']

class ProjectDonorSerializer(serializers.ModelSerializer):
    donor_name = serializers.CharField(source='donor.donor_name', read_only=True)
    
    class Meta:
        model = ProjectDonor
        fields = ['id', 'donor', 'donor_name']

class ProjectListSerializer(serializers.ModelSerializer):
    approval_status_name = serializers.CharField(source='approval_status.status_name', read_only=True)
    fund_code = serializers.CharField(source='fund.fund_code', read_only=True)
    country_name = serializers.CharField(source='country.country_name', read_only=True)
    lead_org_unit_name = serializers.CharField(source='lead_org_unit.org_unit_name', read_only=True)
    theme_name = serializers.CharField(source='theme.theme_name', read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'project_id', 'project_title', 'paas_code', 
            'approval_status', 'approval_status_name',
            'fund', 'fund_code',
            'pag_value', 'start_date', 'end_date', 
            'country', 'country_name',
            'lead_org_unit', 'lead_org_unit_name',
            'theme', 'theme_name',
            'total_expenditure', 'total_contribution', 'total_psc'
        ]

class ProjectDetailSerializer(serializers.ModelSerializer):
    approval_status_name = serializers.CharField(source='approval_status.status_name', read_only=True)
    fund_code = serializers.CharField(source='fund.fund_code', read_only=True)
    country_name = serializers.CharField(source='country.country_name', read_only=True)
    lead_org_unit_name = serializers.CharField(source='lead_org_unit.org_unit_name', read_only=True)
    theme_name = serializers.CharField(source='theme.theme_name', read_only=True)
    donors = DonorSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'project_id', 'project_title', 'paas_code', 
            'approval_status', 'approval_status_name',
            'fund', 'fund_code',
            'pag_value', 'start_date', 'end_date', 
            'country', 'country_name',
            'lead_org_unit', 'lead_org_unit_name',
            'theme', 'theme_name',
            'total_expenditure', 'total_contribution', 'total_psc',
            'donors'
        ]
