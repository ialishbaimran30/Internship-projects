from rest_framework import serializers
from .models import Savings


class SavingsSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.SerializerMethodField()
    remaining = serializers.SerializerMethodField()

    class Meta:
        model = Savings
        fields = [
            "id", "title", "target_amount", "saved_amount", 
            "progress_percentage", "remaining", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "saved_amount", "created_at", "updated_at"]

    def get_progress_percentage(self, obj):
        if obj.target_amount:
            return round((obj.saved_amount / obj.target_amount) * 100, 2)
        return 0

    def get_remaining(self, obj):
        remaining = obj.target_amount - obj.saved_amount
        return remaining if remaining > 0 else 0

    def validate_target_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Target amount must be greater than zero.")
        return value


class SavingsDepositSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value