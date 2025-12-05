from rest_framework import serializers
from .models import Certificate, Tutorial
from django.contrib.auth.models import User

class CertificateSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    tutorial_title = serializers.SerializerMethodField()
    issued_date_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = Certificate
        fields = ['id', 'user_name', 'tutorial_title', 'issued_date', 'issued_date_formatted', 'certificate_number']
    
    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.username
    
    def get_tutorial_title(self, obj):
        return obj.tutorial.title
    
    def get_issued_date_formatted(self, obj):
        return obj.issued_date.strftime("%B %d, %Y")
