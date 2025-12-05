from django.urls import path
from .certificate_views import CertificateViewSet

urlpatterns = [
    path('', CertificateViewSet.as_view({'get': 'my_certificates'}), name='my_certificates'),
    path('issue/', CertificateViewSet.as_view({'post': 'issue_for_tutorial'}), name='issue_certificate'),
    path('<int:pk>/download/', CertificateViewSet.as_view({'get': 'download_pdf'}), name='download_certificate'),
]
