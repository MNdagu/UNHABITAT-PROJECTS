from django.core.management.base import BaseCommand
from projects.models import (
    ApprovalStatus, Fund, Country, LeadOrgUnit, 
    Theme, Donor, Project, ProjectDonor
)

class Command(BaseCommand):
    help = 'Load initial data for the UN-Habitat project'

    def handle(self, *args, **kwargs):
        self.stdout.write('Loading initial data...')
        
        # Create approval statuses
        self.stdout.write('Creating approval statuses...')
        approved, _ = ApprovalStatus.objects.get_or_create(status_name='Approved')
        pending, _ = ApprovalStatus.objects.get_or_create(status_name='Pending Approval')
        
        # Create funds
        self.stdout.write('Creating funds...')
        fno, _ = Fund.objects.get_or_create(fund_code='FNO')
        fne, _ = Fund.objects.get_or_create(fund_code='FNE')
        fod, _ = Fund.objects.get_or_create(fund_code='FOD')
        fjo, _ = Fund.objects.get_or_create(fund_code='FJO')
        qxb, _ = Fund.objects.get_or_create(fund_code='QXB')
        
        # Create countries
        self.stdout.write('Creating countries...')
        global_country, _ = Country.objects.get_or_create(country_name='GLOBAL')
        kenya, _ = Country.objects.get_or_create(country_name='Kenya')
        uganda, _ = Country.objects.get_or_create(country_name='Uganda')
        
        # Create lead org units
        self.stdout.write('Creating lead org units...')
        urban_economy, _ = LeadOrgUnit.objects.get_or_create(org_unit_name='Urban Economy')
        urban_planning, _ = LeadOrgUnit.objects.get_or_create(org_unit_name='Urban Planning')
        
        # Create themes
        self.stdout.write('Creating themes...')
        urban_economy_theme, _ = Theme.objects.get_or_create(theme_name='Urban Economy')
        urban_planning_theme, _ = Theme.objects.get_or_create(theme_name='Urban Planning')
        
        # Create donors
        self.stdout.write('Creating donors...')
        basf, _ = Donor.objects.get_or_create(donor_name='BASF Stiftung')
        norway, _ = Donor.objects.get_or_create(donor_name='PM of Norway to the United Nations')
        
        # Create projects
        self.stdout.write('Creating projects...')
        project, created = Project.objects.get_or_create(
            project_id=1000,
            defaults={
                'project_title': 'FSGLO10S05:Youth Empowerment for Urban Development',
                'paas_code': 'H139',
                'approval_status': approved,
                'fund': fno,
                'pag_value': 4218607.00,
                'start_date': '2012-01-01',
                'end_date': '2013-12-31',
                'country': global_country,
                'lead_org_unit': urban_economy,
                'theme': urban_economy_theme,
                'total_expenditure': 4439757.00,
                'total_contribution': 4329257.00,
                'total_psc': 316548.00
            }
        )
        
        if created:
            # Add donors to project
            ProjectDonor.objects.get_or_create(project=project, donor=basf)
            ProjectDonor.objects.get_or_create(project=project, donor=norway)
            
        self.stdout.write(self.style.SUCCESS('Successfully loaded initial data'))
