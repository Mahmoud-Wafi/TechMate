# from django.urls import path
# from .views import (
#     TutorialListCreateView, TutorialDetailView, TutorialContentCreateView,
#     TutorialContentDetailView, UserProgressView, UserDashboardView
# )

# urlpatterns = [
#     path('', TutorialListCreateView.as_view(), name='tutorial_list'),
#     path('<int:pk>/', TutorialDetailView.as_view(), name='tutorial_detail'),
#     path('<int:tutorial_id>/contents/', TutorialContentCreateView.as_view(), name='content_create'),
#     path('contents/<int:pk>/', TutorialContentDetailView.as_view(), name='content_detail'),
#     path('<int:tutorial_id>/progress/', UserProgressView.as_view(), name='user_progress'),
#     path('dashboard/', UserDashboardView.as_view(), name='dashboard'),
# ]


from django.urls import path
from .views import (
    TutorialListCreateView, TutorialDetailView, TutorialContentCreateView,
    TutorialContentDetailView, UserProgressView, UserDashboardView, InstructorMyTutorialsView
)
from .certificate_views import CertificateViewSet

urlpatterns = [
    path('', TutorialListCreateView.as_view(), name='tutorial_list'),
    path('dashboard/', UserDashboardView.as_view(), name='user_dashboard'),
    path('mine/', InstructorMyTutorialsView.as_view(), name='instructor_my_tutorials'),
    path('<int:pk>/', TutorialDetailView.as_view(), name='tutorial_detail'),
    path('<int:tutorial_id>/contents/', TutorialContentCreateView.as_view(), name='content_create'),
    path('contents/<int:pk>/', TutorialContentDetailView.as_view(), name='content_detail'),
    path('<int:tutorial_id>/progress/', UserProgressView.as_view(), name='user_progress'),
]

# Certificate URLs
certificate_urls = [
    path('api/certificates/', CertificateViewSet.as_view({'get': 'my_certificates'}), name='my_certificates'),
    path('api/certificates/issue/', CertificateViewSet.as_view({'post': 'issue_for_tutorial'}), name='issue_certificate'),
    path('api/certificates/<int:pk>/download/', CertificateViewSet.as_view({'get': 'download_pdf'}), name='download_certificate'),
]
