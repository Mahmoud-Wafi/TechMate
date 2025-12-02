from rest_framework import serializers
from .models import Tutorial, TutorialContent, UserTutorialProgress


class TutorialContentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = TutorialContent
        fields = ['id', 'order', 'title', 'description', 'content_type', 'file', 'file_url', 'text', 'duration', 'created_at']
        extra_kwargs = {'file': {'write_only': True}}

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None


class TutorialListSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    content_count = serializers.IntegerField(read_only=True)
    user_progress = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = Tutorial
        fields = ['id', 'title', 'description', 'created_by', 'created_by_name', 'is_featured', 
                  'thumbnail', 'thumbnail_url', 'content_count', 'user_progress', 'created_at']
        extra_kwargs = {'thumbnail': {'write_only': True}}

    def get_user_progress(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            progress = UserTutorialProgress.objects.filter(user=request.user, tutorial=obj).first()
            if progress:
                return {
                    'percentage': float(progress.percentage),
                    'completed': progress.completed,
                    'completed_count': progress.completed_contents.count()
                }
        return None

    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None


class TutorialDetailSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    contents = TutorialContentSerializer(many=True, read_only=True)
    user_progress = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = Tutorial
        fields = ['id', 'title', 'description', 'created_by', 'created_by_name', 'is_featured',
                  'thumbnail', 'thumbnail_url', 'contents', 'user_progress', 'created_at', 'updated_at']
        extra_kwargs = {'thumbnail': {'write_only': True}}

    def get_user_progress(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            progress, created = UserTutorialProgress.objects.get_or_create(user=request.user, tutorial=obj)
            return {
                'percentage': float(progress.percentage),
                'completed': progress.completed,
                'completed_content_ids': list(progress.completed_contents.values_list('id', flat=True))
            }
        return None

    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None


class TutorialCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tutorial
        fields = ['id', 'title', 'description', 'is_featured', 'thumbnail']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class TutorialContentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorialContent
        fields = ['id', 'order', 'title', 'description', 'content_type', 'file', 'text', 'duration']

    def validate(self, data):
        content_type = data.get('content_type')
        if content_type in ['video', 'audio'] and not data.get('file'):
            raise serializers.ValidationError({'file': 'File is required for video/audio content.'})
        if content_type == 'text' and not data.get('text'):
            raise serializers.ValidationError({'text': 'Text content is required for text type.'})
        return data


class UserProgressSerializer(serializers.ModelSerializer):
    completed_content_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    
    class Meta:
        model = UserTutorialProgress
        fields = ['percentage', 'completed', 'completed_content_ids', 'updated_at']
        read_only_fields = ['percentage', 'completed', 'updated_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['completed_content_ids'] = list(instance.completed_contents.values_list('id', flat=True))
        data['total_contents'] = instance.tutorial.contents.count()
        data['completed_count'] = instance.completed_contents.count()
        return data

    def update(self, instance, validated_data):
        content_ids = validated_data.get('completed_content_ids', [])
        valid_contents = TutorialContent.objects.filter(id__in=content_ids, tutorial=instance.tutorial)
        instance.completed_contents.set(valid_contents)
        instance.calculate_progress()
        return instance
