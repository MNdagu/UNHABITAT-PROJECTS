import csv
import io
import os
from datetime import datetime
from django.core.management.base import BaseCommand
from django.conf import settings
from projects.models import (
    ApprovalStatus, Fund, Country, LeadOrgUnit,
    Theme, Donor, Project, ProjectDonor
)

class Command(BaseCommand):
    help = 'Import projects from projects.txt file'

    def handle(self, *args, **kwargs):
        self.stdout.write('Importing projects from projects.txt...')

        # Get the path to the projects.txt file
        projects_file_path = '/home/mark/Development/mine/unhabitatproject/projects.txt'
        self.stdout.write(f'Looking for projects.txt at: {projects_file_path}')

        # Read the projects.txt file
        with open(projects_file_path, 'r') as file:
            # Skip the first line (header)
            next(file)

            # Read the rest of the lines
            for line in file:
                # Skip empty lines
                if not line.strip():
                    continue

                # Split the line by tabs
                fields = line.strip().split('\t')

                # Check if we have enough fields
                if len(fields) < 16:
                    self.stdout.write(self.style.WARNING(f'Skipping line with insufficient fields: {line}'))
                    continue

                # Extract fields
                project_id = fields[0]
                project_title = fields[1]
                paas_code = fields[2]
                approval_status_name = fields[3]
                fund_code = fields[4]
                pag_value = fields[5].replace(',', '') if fields[5] else None
                start_date = self._parse_date(fields[6])
                end_date = self._parse_date(fields[7])
                country_name = fields[8]
                lead_org_unit_name = fields[9]
                theme_name = fields[10]
                donors_text = fields[11]
                total_expenditure = fields[12].replace(',', '') if fields[12] else None
                total_contribution = fields[13].replace(',', '') if fields[13] else None
                total_psc = fields[15].replace(',', '') if fields[15] else None

                # Get or create approval status
                approval_status, _ = ApprovalStatus.objects.get_or_create(
                    status_name=approval_status_name
                )

                # Get or create fund
                fund, _ = Fund.objects.get_or_create(
                    fund_code=fund_code
                )

                # Get or create country
                country, _ = Country.objects.get_or_create(
                    country_name=country_name
                )

                # Get or create lead org unit
                lead_org_unit = None
                if lead_org_unit_name:
                    lead_org_unit, _ = LeadOrgUnit.objects.get_or_create(
                        org_unit_name=lead_org_unit_name
                    )

                # Get or create theme
                theme = None
                if theme_name:
                    theme, _ = Theme.objects.get_or_create(
                        theme_name=theme_name
                    )

                # Create or update project
                project, created = Project.objects.update_or_create(
                    project_id=project_id,
                    defaults={
                        'project_title': project_title,
                        'paas_code': paas_code,
                        'approval_status': approval_status,
                        'fund': fund,
                        'pag_value': pag_value,
                        'start_date': start_date,
                        'end_date': end_date,
                        'country': country,
                        'lead_org_unit': lead_org_unit,
                        'theme': theme,
                        'total_expenditure': total_expenditure,
                        'total_contribution': total_contribution,
                        'total_psc': total_psc
                    }
                )

                # Process donors
                if donors_text:
                    donors_list = [d.strip() for d in donors_text.split(',') if d.strip()]
                    for donor_name in donors_list:
                        donor, _ = Donor.objects.get_or_create(
                            donor_name=donor_name
                        )
                        ProjectDonor.objects.get_or_create(
                            project=project,
                            donor=donor
                        )

                if created:
                    self.stdout.write(self.style.SUCCESS(f'Created project {project_id}: {project_title}'))
                else:
                    self.stdout.write(self.style.SUCCESS(f'Updated project {project_id}: {project_title}'))

        self.stdout.write(self.style.SUCCESS('Successfully imported projects from projects.txt'))

    def _parse_date(self, date_str):
        if not date_str or date_str.strip() == '':
            return None

        try:
            # Format in the file is like "1-Jan-12" or "31-Dec-13"
            parts = date_str.split('-')
            if len(parts) == 3:
                day, month_name, year = parts

                # Convert month name to number
                month_map = {
                    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
                    'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
                }

                if month_name in month_map:
                    month = month_map[month_name]
                else:
                    self.stdout.write(self.style.WARNING(f'Unknown month: {month_name} in date: {date_str}'))
                    return None

                # Ensure year has 4 digits
                if len(year) == 2:
                    year = '20' + year

                # Create date object
                return datetime(int(year), month, int(day)).date()

            self.stdout.write(self.style.WARNING(f'Could not parse date format: {date_str}'))
            return None
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'Error parsing date {date_str}: {str(e)}'))
            return None
