from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import FileResponse
from .models import Certificate, Tutorial, UserTutorialProgress
from .certificate_generator import generate_certificate_pdf, generate_certificate_filename
from .certificate_serializer import CertificateSerializer

class CertificateViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def my_certificates(self, request):
        """Get all user's certificates"""
        try:
            certificates = Certificate.objects.filter(user=request.user)
            serializer = CertificateSerializer(certificates, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error fetching certificates: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def issue_for_tutorial(self, request):
        """Issue certificate after completing tutorial"""
        try:
            tutorial_id = request.data.get('tutorial_id')
            if not tutorial_id:
                return Response({'error': 'tutorial_id required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get tutorial
            try:
                tutorial = Tutorial.objects.get(id=tutorial_id)
            except Tutorial.DoesNotExist:
                return Response({'error': 'Tutorial not found'}, status=status.HTTP_404_NOT_FOUND)
            
            # Check if user completed the tutorial
            try:
                progress = UserTutorialProgress.objects.get(
                    user=request.user,
                    tutorial=tutorial
                )
            except UserTutorialProgress.DoesNotExist:
                return Response({'error': 'No progress found for this tutorial'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if 100% complete
            if not progress.completed or progress.percentage < 100:
                return Response({
                    'error': 'Tutorial not fully completed',
                    'percentage': float(progress.percentage)
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create certificate
            certificate, created = Certificate.objects.get_or_create(
                user=request.user,
                tutorial=tutorial
            )
            serializer = CertificateSerializer(certificate)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
            )
        except Exception as e:
            print(f"Error issuing certificate: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def download_pdf(self, request, pk=None):
        """Download certificate PDF"""
        try:
            certificate = Certificate.objects.get(id=pk, user=request.user)
            pdf_buffer = generate_certificate_pdf(
                certificate.user,
                certificate.tutorial,
                certificate.certificate_number
            )
            filename = generate_certificate_filename(certificate.user, certificate.tutorial)
            return FileResponse(
                pdf_buffer,
                as_attachment=True,
                filename=filename,
                content_type='application/pdf'
            )
        except Certificate.DoesNotExist:
            return Response({'error': 'Certificate not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error downloading certificate: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
