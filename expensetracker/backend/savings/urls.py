from django.urls import path
from .views import (
    SavingsListCreateView, SavingsDetailView,
    SavingsDepositView, SavingsWithdrawView, SavingsSummaryView,
)

urlpatterns = [
    path("", SavingsListCreateView.as_view(), name="savings-list"),
    path("summary/", SavingsSummaryView.as_view(), name="savings-summary"),
    path("<int:pk>/", SavingsDetailView.as_view(), name="savings-detail"),
    path("<int:pk>/deposit/", SavingsDepositView.as_view(), name="savings-deposit"),
    path("<int:pk>/withdraw/", SavingsWithdrawView.as_view(), name="savings-withdraw"),
]