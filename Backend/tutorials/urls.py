from django.urls import path
from .views import (
    TutorialListCreateView, TutorialDetailView, TutorialContentCreateView,
    TutorialContentDetailView, UserProgressView, UserDashboardView
)

urlpatterns = [
    path('', TutorialListCreateView.as_view(), name='tutorial_list'),
    path('<int:pk>/', TutorialDetailView.as_view(), name='tutorial_detail'),
    path('<int:tutorial_id>/contents/', TutorialContentCreateView.as_view(), name='content_create'),
    path('contents/<int:pk>/', TutorialContentDetailView.as_view(), name='content_detail'),
    path('<int:tutorial_id>/progress/', UserProgressView.as_view(), name='user_progress'),
    path('dashboard/', UserDashboardView.as_view(), name='dashboard'),
]