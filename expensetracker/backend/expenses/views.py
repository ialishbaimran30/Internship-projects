from django.utils import timezone
from django.db.models import Sum, Max, Min
from django.core.cache import cache
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Category, Expense
from .serializers import CategorySerializer, ExpenseSerializer
from .filters import ExpenseFilter
import time
from budgets.models import Budget


def dashboard_cache_key(user_id):
    return f"expense_dashboard_{user_id}"


class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(owner=self.request.user)

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()


class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]
    filterset_class = ExpenseFilter
    search_fields = ["title", "description"]
    ordering_fields = ["amount", "date", "created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return Expense.objects.filter(
            owner=self.request.user,
            is_deleted=False,
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        # A new expense changes the dashboard totals — clear the stale cache.
        cache.delete(dashboard_cache_key(self.request.user.id))


class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(
            owner=self.request.user,
            is_deleted=False,
        )

    def perform_update(self, serializer):
        serializer.save()
        cache.delete(dashboard_cache_key(self.request.user.id))

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()
        cache.delete(dashboard_cache_key(self.request.user.id))


class ExpenseDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start = time.time() # 
        # #####
        cache_key = dashboard_cache_key(request.user.id)
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            print("CACHE HIT") #
            print(f"Time: {time.time() - start:.5f} seconds") #
            return Response(cached_data)
        print("DATABASE HIT") #

        queryset = Expense.objects.filter(
            owner=request.user,
            is_deleted=False,
        )

        today = timezone.now().date()
        budget = Budget.objects.filter(owner=request.user,month=today.month,year=today.year,).first()

        total_expense = (
            queryset.aggregate(total=Sum("amount"))["total"] or 0
        )

        today_expense = (
            queryset.filter(date=today)
            .aggregate(total=Sum("amount"))["total"] or 0
        )

        highest = (
            queryset.aggregate(highest=Max("amount"))["highest"] or 0
        )

        lowest = (
            queryset.aggregate(lowest=Min("amount"))["lowest"] or 0
        )

        total_categories = (
            queryset.values("category").distinct().count()
        )

        total_expenses = queryset.count()
        warning = None
        if budget:
            remaining = budget.monthly_budget - total_expense

            if remaining < 0:
                warning = f"Budget exceeded by Rs {abs(remaining)}"

        data = {
            "total_expense": total_expense,
            "today_expense": today_expense,
            "highest_expense": highest,
            "lowest_expense": lowest,
            "total_categories": total_categories,
            "total_expenses": total_expenses,
            "warning":warning,
        }

        # Cache for 60 seconds — dashboard doesn't need to be recalculated
        # on every single page load, only when it's actually gone stale.
        cache.set(cache_key, data, timeout=60)
        print(f"Time: {time.time() - start:.5f} seconds")

        return Response(data)