# accounts/admin.py
from django.contrib import admin
from .models import Profile

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'is_approved_instructor')
    list_filter = ('role', 'is_approved_instructor')
    search_fields = ('user__username', 'user__email')
    list_editable = ('is_approved_instructor',)
    actions = ['approve_instructors', 'revoke_instructors']

    def approve_instructors(self, request, queryset):
        updated = queryset.update(is_approved_instructor=True)
        self.message_user(request, f"{updated} profile(s) approved as instructor.")
    approve_instructors.short_description = "Approve selected profiles as instructors"

    def revoke_instructors(self, request, queryset):
        updated = queryset.update(is_approved_instructor=False)
        self.message_user(request, f"{updated} profile(s) revoked instructor approval.")
    revoke_instructors.short_description = "Revoke instructor approval for selected profiles"
