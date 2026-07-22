from datetime import date
from .models import Category,  Expense
from rest_framework import serializers

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ["id","name","created_at","updated_at",]
        read_only_fields = ["id","created_at","updated_at",]

class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name",read_only=True)

    class Meta:
        model = Expense
        fields = ["id","title","amount","category","category_name","date","payment_method","description","receipt","favorite","created_at","updated_at",]
        read_only_fields = ["id","created_at","updated_at",]

    def validate_amount(self, value):

        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value
        
    def validate_date(self, value):

        if value > date.today():
            raise serializers.ValidationError("Future date is not allowed.")
        return value