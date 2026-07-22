from django.db.models import Sum
from django.core.cache import cache
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Savings
from .serializers import SavingsSerializer, SavingsDepositSerializer

# Create your views here.


def savings_summary_cache_key(user_id):
    return f"savings_summary_{user_id}"


class SavingsListCreateView(generics.ListCreateAPIView):
    serializer_class = SavingsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Savings.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        cache.delete(savings_summary_cache_key(self.request.user.id))


class SavingsDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SavingsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Savings.objects.filter(owner=self.request.user)

    def perform_update(self, serializer):
        serializer.save()
        cache.delete(savings_summary_cache_key(self.request.user.id))

    def perform_destroy(self, instance):
        cache.delete(savings_summary_cache_key(self.request.user.id))
        instance.delete()


class SavingsDepositView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            goal = Savings.objects.get(pk=pk, owner=request.user)
        except Savings.DoesNotExist:
            return Response({"error": "Savings goal not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = SavingsDepositSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        goal.saved_amount += serializer.validated_data["amount"]
        goal.save()
        cache.delete(savings_summary_cache_key(request.user.id))

        return Response(SavingsSerializer(goal).data, status=status.HTTP_200_OK)


class SavingsWithdrawView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            goal = Savings.objects.get(pk=pk, owner=request.user)
        except Savings.DoesNotExist:
            return Response({"error": "Savings goal not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = SavingsDepositSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        amount = serializer.validated_data["amount"]

        if amount > goal.saved_amount:
            return Response(
                {"error": "Cannot withdraw more than the saved amount."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        goal.saved_amount -= amount
        goal.save()
        cache.delete(savings_summary_cache_key(request.user.id))

        return Response(SavingsSerializer(goal).data, status=status.HTTP_200_OK)


class SavingsSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cache_key = savings_summary_cache_key(request.user.id)
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            return Response(cached_data)

        queryset = Savings.objects.filter(owner=request.user)

        total_saved = queryset.aggregate(total=Sum("saved_amount"))["total"] or 0
        total_target = queryset.aggregate(total=Sum("target_amount"))["total"] or 0
        total_goals = queryset.count()

        data = {
            "total_saved": total_saved,
            "total_target": total_target,
            "total_goals": total_goals,
        }

        cache.set(cache_key, data, timeout=60)

        return Response(data)