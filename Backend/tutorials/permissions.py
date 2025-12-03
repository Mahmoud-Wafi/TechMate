from rest_framework import permissions
class IsInstructorOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user.is_authenticated:
            return False
        if hasattr(request.user, 'profile'):
            return request.user.profile.role in ['instructor', 'admin']
        if hasattr(request.user, 'profile') and request.user.profile.role == 'instructor':
            return bool(request.user.profile.is_approved_instructor)
        return False
        


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user.is_authenticated:
            return False
        if hasattr(request.user, 'profile') and request.user.profile.role == 'admin':
            return True
        if hasattr(obj, 'created_by'):
            return obj.created_by == request.user
        if hasattr(obj, 'tutorial'):
            return obj.tutorial.created_by == request.user
        return False
    
    
