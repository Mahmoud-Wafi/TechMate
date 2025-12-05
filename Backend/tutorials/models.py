from typing import TYPE_CHECKING
from django.db import models
from django.contrib.auth.models import User
import uuid

if TYPE_CHECKING:
    from django.db.models import QuerySet


class Tutorial(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tutorials')
    is_featured = models.BooleanField(default=False)
    thumbnail = models.ImageField(upload_to='tutorials/thumbnails/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.title

    class Meta:
        ordering = ['-created_at']

    @property
    def content_count(self) -> int:
        return self.contents.count()


class TutorialContent(models.Model):
    CONTENT_TYPE_CHOICES = [
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('text', 'Text'),
    ]
    
    tutorial = models.ForeignKey(Tutorial, on_delete=models.CASCADE, related_name='contents')
    order = models.PositiveIntegerField(default=0)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    content_type = models.CharField(max_length=10, choices=CONTENT_TYPE_CHOICES)
    file = models.FileField(upload_to='tutorials/content/', null=True, blank=True)
    text = models.TextField(blank=True)
    duration = models.PositiveIntegerField(null=True, blank=True, help_text='Duration in seconds')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.tutorial.title} - {self.title}"

    class Meta:
        ordering = ['order']


class UserTutorialProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tutorial_progress')
    tutorial = models.ForeignKey(Tutorial, on_delete=models.CASCADE, related_name='user_progress')
    completed_contents = models.ManyToManyField(TutorialContent, blank=True, related_name='completed_by')
    completed = models.BooleanField(default=False)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'tutorial']
        ordering = ['-updated_at']

    def __str__(self) -> str:
        return f"{self.user.username} - {self.tutorial.title} - {self.percentage}%"

    def calculate_progress(self) -> 'UserTutorialProgress':
        total_contents = self.tutorial.contents.count()
        if total_contents == 0:
            self.percentage = 0
            self.completed = False
        else:
            completed_count = self.completed_contents.count()
            self.percentage = round((completed_count / total_contents) * 100, 2)
            self.completed = completed_count == total_contents
        self.save()
        return self


# class Certificate(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='certificates')
#     tutorial = models.ForeignKey(Tutorial, on_delete=models.CASCADE, related_name='certificates')
#     issued_date = models.DateTimeField(auto_now_add=True)
#     certificate_number = models.CharField(max_length=50, unique=True)
    
#     class Meta:
#         unique_together = ('user', 'tutorial')
#         ordering = ['-issued_date']
    
#     def __str__(self) -> str:
#         return f"{self.user.get_full_name()} - {self.tutorial.title}"
    
#     def save(self, *args, **kwargs):
#         if not self.certificate_number:
#             self.certificate_number = f"TM-{uuid.uuid4().hex[:10].upper()}"
#         super().save(*args, **kwargs)
