from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Tag(models.Model):
    name= models.CharField(max_length=50)

    def __str__(self):
        return self.name
    
class Task(models.Model):
      PRIORITY_CHOICES = [
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
    ]
      STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Completed", "Completed"),
    ]
      
      user = models.ForeignKey(User,on_delete=models.CASCADE)
      title = models.CharField(max_length=200)
      description = models.TextField()
      due_date = models.DateField()
      priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES,default="Medium")

      status = models.CharField(
    max_length=20,
    choices=STATUS_CHOICES,
    default="Pending")


      category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE
    )

      tags = models.ManyToManyField(Tag)
      create_at = models.DateTimeField(auto_now_add=True)

      def __str__(self):
          return self.title