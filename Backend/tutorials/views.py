# from rest_framework import status, generics
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
# from rest_framework.parsers import MultiPartParser, FormParser
# from django.shortcuts import get_object_or_404
# from .models import Tutorial, TutorialContent, UserTutorialProgress
# from .serializers import (
#     TutorialListSerializer, TutorialDetailSerializer, TutorialCreateSerializer,
#     TutorialContentSerializer, TutorialContentCreateSerializer, UserProgressSerializer
# )
# from .permissions import IsInstructorOrAdmin, IsOwnerOrAdmin


# class TutorialListCreateView(generics.ListCreateAPIView):
#     queryset = Tutorial.objects.all()
#     permission_classes = [IsAuthenticatedOrReadOnly, IsInstructorOrAdmin]
#     parser_classes = [MultiPartParser, FormParser]

#     def get_serializer_class(self):
#         if self.request.method == 'POST':
#             return TutorialCreateSerializer
#         return TutorialListSerializer

#     def get_queryset(self):
#         queryset = Tutorial.objects.all()
#         search = self.request.query_params.get('search', '')
#         featured = self.request.query_params.get('featured', '')
#         instructor = self.request.query_params.get('instructor', '')
        
#         if search:
#             queryset = queryset.filter(title__icontains=search)
#         if featured.lower() == 'true':
#             queryset = queryset.filter(is_featured=True)
#         if instructor:
#             queryset = queryset.filter(created_by__username=instructor)
        
#         return queryset


# class TutorialDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Tutorial.objects.all()
#     permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrAdmin]
#     parser_classes = [MultiPartParser, FormParser]

#     def get_serializer_class(self):
#         if self.request.method in ['PATCH', 'PUT']:
#             return TutorialCreateSerializer
#         return TutorialDetailSerializer


# class TutorialContentCreateView(APIView):
#     permission_classes = [IsAuthenticated, IsInstructorOrAdmin]
#     parser_classes = [MultiPartParser, FormParser]

#     def post(self, request, tutorial_id):
#         tutorial = get_object_or_404(Tutorial, id=tutorial_id)
#         if not IsOwnerOrAdmin().has_object_permission(request, self, tutorial):
#             return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
#         serializer = TutorialContentCreateSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save(tutorial=tutorial)
#             return Response(TutorialContentSerializer(serializer.instance, context={'request': request}).data, 
#                           status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class TutorialContentDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = TutorialContent.objects.all()
#     serializer_class = TutorialContentSerializer
#     permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrAdmin]
#     parser_classes = [MultiPartParser, FormParser]

#     def get_serializer_class(self):
#         if self.request.method in ['PATCH', 'PUT']:
#             return TutorialContentCreateSerializer
#         return TutorialContentSerializer

#     def destroy(self, request, *args, **kwargs):
#         content = self.get_object()
#         tutorial = content.tutorial
#         response = super().destroy(request, *args, **kwargs)
#         for progress in tutorial.user_progress.all():
#             progress.calculate_progress()
#         return response


# class UserProgressView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, tutorial_id):
#         tutorial = get_object_or_404(Tutorial, id=tutorial_id)
#         progress, created = UserTutorialProgress.objects.get_or_create(user=request.user, tutorial=tutorial)
#         serializer = UserProgressSerializer(progress)
#         return Response(serializer.data)

#     def patch(self, request, tutorial_id):
#         tutorial = get_object_or_404(Tutorial, id=tutorial_id)
#         progress, created = UserTutorialProgress.objects.get_or_create(user=request.user, tutorial=tutorial)
#         serializer = UserProgressSerializer(progress, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class UserDashboardView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user_progress = UserTutorialProgress.objects.filter(user=request.user)
#         in_progress = user_progress.filter(completed=False, percentage__gt=0).count()
#         completed = user_progress.filter(completed=True).count()
#         total_tutorials = Tutorial.objects.count()
        
#         recent_progress = user_progress.order_by('-updated_at')[:5]
#         recent_tutorials = []
#         for progress in recent_progress:
#             recent_tutorials.append({
#                 'tutorial_id': progress.tutorial.id,
#                 'tutorial_title': progress.tutorial.title,
#                 'percentage': float(progress.percentage),
#                 'completed': progress.completed
#             })
        
#         return Response({
#             'stats': {
#                 'in_progress': in_progress,
#                 'completed': completed,
#                 'total_tutorials': total_tutorials
#             },
#             'recent_tutorials': recent_tutorials
#         })

from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import Tutorial, TutorialContent, UserTutorialProgress
from .serializers import (
    TutorialListSerializer, TutorialDetailSerializer, TutorialCreateSerializer,
    TutorialContentSerializer, TutorialContentCreateSerializer, UserProgressSerializer
)
from .permissions import IsInstructorOrAdmin, IsOwnerOrAdmin

class TutorialListCreateView(generics.ListCreateAPIView):
    queryset = Tutorial.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly, IsInstructorOrAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TutorialCreateSerializer
        return TutorialListSerializer

    def get_queryset(self):
        queryset = Tutorial.objects.all()
        search = self.request.query_params.get('search', '')
        featured = self.request.query_params.get('featured', '')
        instructor = self.request.query_params.get('instructor', '')
        
        if search:
            queryset = queryset.filter(title__icontains=search)
        if featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)
        if instructor:
            queryset = queryset.filter(created_by__username=instructor)
        # if instructor query param is "me" and user is instructor, filter own tutorials:
        me = self.request.query_params.get('me', '')
        if me.lower() == 'true' and self.request.user.is_authenticated:
            queryset = queryset.filter(created_by=self.request.user)
        return queryset

class TutorialDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tutorial.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'PUT']:
            return TutorialCreateSerializer
        return TutorialDetailSerializer

class TutorialContentCreateView(APIView):
    permission_classes = [IsAuthenticated, IsInstructorOrAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, tutorial_id):
        tutorial = get_object_or_404(Tutorial, id=tutorial_id)
        if not IsOwnerOrAdmin().has_object_permission(request, self, tutorial):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        serializer = TutorialContentCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(tutorial=tutorial)
            # update progress for existing users? Not necessary here (created contents will reduce percentage for users)
            return Response(TutorialContentSerializer(serializer.instance, context={'request': request}).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TutorialContentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TutorialContent.objects.all()
    serializer_class = TutorialContentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'PUT']:
            return TutorialContentCreateSerializer
        return TutorialContentSerializer

    def destroy(self, request, *args, **kwargs):
        content = self.get_object()
        tutorial = content.tutorial
        response = super().destroy(request, *args, **kwargs)
        # recalc progress for users of this tutorial
        for progress in tutorial.user_progress.all():
            progress.calculate_progress()
        return response

class UserProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tutorial_id):
        tutorial = get_object_or_404(Tutorial, id=tutorial_id)
        progress, created = UserTutorialProgress.objects.get_or_create(user=request.user, tutorial=tutorial)
        serializer = UserProgressSerializer(progress)
        return Response(serializer.data)

    def patch(self, request, tutorial_id):
        tutorial = get_object_or_404(Tutorial, id=tutorial_id)
        progress, created = UserTutorialProgress.objects.get_or_create(user=request.user, tutorial=tutorial)
        serializer = UserProgressSerializer(progress, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_progress = UserTutorialProgress.objects.filter(user=request.user)
        in_progress = user_progress.filter(completed=False, percentage__gt=0).count()
        completed = user_progress.filter(completed=True).count()
        total_tutorials = Tutorial.objects.count()
        
        recent_progress = user_progress.order_by('-updated_at')[:5]
        recent_tutorials = []
        for progress in recent_progress:
            recent_tutorials.append({
                'tutorial_id': progress.tutorial.id,
                'tutorial_title': progress.tutorial.title,
                'percentage': float(progress.percentage),
                'completed': progress.completed
            })
        
        return Response({
            'stats': {
                'in_progress': in_progress,
                'completed': completed,
                'total_tutorials': total_tutorials
            },
            'recent_tutorials': recent_tutorials
        })

# Instructor-specific endpoint: list tutorials created by current user (convenience)
class InstructorMyTutorialsView(generics.ListAPIView):
    serializer_class = TutorialListSerializer
    permission_classes = [IsAuthenticated, IsInstructorOrAdmin]

    def get_queryset(self):
        return Tutorial.objects.filter(created_by=self.request.user).order_by('-created_at')

