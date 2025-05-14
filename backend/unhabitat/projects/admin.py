from django.contrib import admin
from .models import (
    ApprovalStatus, Fund, Country, LeadOrgUnit,
    Theme, Donor, Project, ProjectDonor
)

# Register models
admin.site.register(ApprovalStatus)
admin.site.register(Fund)
admin.site.register(Country)
admin.site.register(LeadOrgUnit)
admin.site.register(Theme)
admin.site.register(Donor)
admin.site.register(ProjectDonor)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('project_id', 'project_title', 'country', 'approval_status', 'start_date', 'end_date')
    list_filter = ('approval_status', 'country', 'lead_org_unit', 'theme')
    search_fields = ('project_title', 'paas_code')
