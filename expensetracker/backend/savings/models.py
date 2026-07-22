from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator

# Create your models here.

class Savings(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="savings_goals")
    title = models.CharField(max_length=150)
    target_amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(1)])
    saved_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    # target_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["owner"])]

    def __str__(self):
        return f"{self.title} - {self.saved_amount}/{self.target_amount}"