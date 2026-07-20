from rest_framework import serializers
from .models import Task,Category,Tag,Notification
from django.contrib.auth.models import User

class Taskserializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()
    elapsed_minutes = serializers.SerializerMethodField()
    class Meta:
        model = Task
        fields= ["id", "user", "title", "description", "due_date","priority", "status", "category", "tags", "create_at","time_spent_minutes", "timer_started_at","progress", "elapsed_minutes",]
        read_only_fields=["user","create_at"]

    def get_progress(self, obj):
        return {"Pending": 0, "In Progress": 50, "Completed": 100}.get(obj.status, 0)
 
    def get_elapsed_minutes(self, obj):
        total = obj.time_spent_minutes
        if obj.timer_started_at:
            from django.utils import timezone
            running = (timezone.now() - obj.timer_started_at).total_seconds() / 60
            total += int(running)
        return total

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"
        read_only_fields=["user"]

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"
        read_only_fields=["user"]

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
        read_only_fields = ["user"]

# class RegisterSerializer(serializers.ModelSerializer):
#     class Meta:
#         model= User
#         fields=["username","password"]
#     def create(self,validated_data):
#         user=User.objects.create_user(
#             username=validated_data["username"],
#             password= validated_data["password"]
#         )
#         return user