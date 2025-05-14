from django.db import models

class ApprovalStatus(models.Model):
    status_name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.status_name

class Fund(models.Model):
    fund_code = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.fund_code

class Country(models.Model):
    country_name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.country_name

class LeadOrgUnit(models.Model):
    org_unit_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.org_unit_name

class Theme(models.Model):
    theme_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.theme_name

class Donor(models.Model):
    donor_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.donor_name

class Project(models.Model):
    project_id = models.IntegerField(primary_key=True)
    project_title = models.CharField(max_length=255)
    paas_code = models.CharField(max_length=50, null=True, blank=True)
    approval_status = models.ForeignKey(ApprovalStatus, on_delete=models.PROTECT)
    fund = models.ForeignKey(Fund, on_delete=models.PROTECT)
    pag_value = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    country = models.ForeignKey(Country, on_delete=models.PROTECT)
    lead_org_unit = models.ForeignKey(LeadOrgUnit, on_delete=models.PROTECT, null=True, blank=True)
    theme = models.ForeignKey(Theme, on_delete=models.PROTECT, null=True, blank=True)
    total_expenditure = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    total_contribution = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    total_psc = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    donors = models.ManyToManyField(Donor, through='ProjectDonor')

    def __str__(self):
        return f"{self.project_id}: {self.project_title}"

class ProjectDonor(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    donor = models.ForeignKey(Donor, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('project', 'donor')

    def __str__(self):
        return f"{self.project.project_title} - {self.donor.donor_name}"
