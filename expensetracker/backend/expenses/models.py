from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
# Create your models here.

class PaymentMethod(models.TextChoices):
    CASH = "Cash", "Cash"
    CREDIT_CARD = "Credit Card", "Credit Card"
    DEBIT_CARD = "Debit Card", "Debit Card"
    BANK_TRANSFER = "Bank Transfer", "Bank Transfer"
    JAZZCASH = "JazzCash", "JazzCash"
    EASYPAISA = "Easypaisa", "Easypaisa"
    OTHER = "Other", "Other"

class Category(models.Model):

    name = models.CharField(max_length=100)
    owner = models.ForeignKey(User,on_delete=models.CASCADE,related_name="categories",null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ["name"]
        unique_together=("owner","name")

    def __str__(self):
        return self.name
    
class Expense(models.Model):
    owner = models.ForeignKey(User,on_delete=models.CASCADE,related_name="expenses")
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10,decimal_places=2,validators=[MinValueValidator(1)])
    category = models.ForeignKey(Category,on_delete=models.SET_NULL,null=True,related_name="expenses")
    date = models.DateField()
    payment_method = models.CharField(max_length=30,choices=PaymentMethod.choices,default=PaymentMethod.CASH)
    description = models.TextField(blank=True)
    receipt = models.ImageField(upload_to="receipts/",blank=True,null=True)
    favorite = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-created_at"]
        indexes = [models.Index(fields=["owner"]),models.Index(fields=["date"]),models.Index(fields=["category"]), models.Index(fields=["favorite"]),]

    def __str__(self):
        return f"{self.title} - {self.amount}"