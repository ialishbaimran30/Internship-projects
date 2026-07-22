from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Budget(models.Model):
    owner = models.ForeignKey(User,on_delete=models.CASCADE,related_name="budgets")
    monthly_budget = models.DecimalField(max_digits=10,decimal_places=2)
    month = models.PositiveSmallIntegerField()
    year = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("owner", "month", "year")
        ordering = ["-year", "-month"]

    def __str__(self):
        return f"{self.owner.username} - {self.month}/{self.year}"
print("budget model loaded")