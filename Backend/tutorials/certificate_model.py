from django.db import models
from django.contrib.auth.models import User
from .models import Tutorial

class Certificate(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='certificates')
    tutorial = models.ForeignKey(Tutorial, on_delete=models.CASCADE, related_name='certificates')
    issued_date = models.DateTimeField(auto_now_add=True)
    certificate_number = models.CharField(max_length=50, unique=True)
    
    class Meta:
        unique_together = ('user', 'tutorial')
        ordering = ['-issued_date']
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.tutorial.title}"
    
    def save(self, *args, **kwargs):
        if not self.certificate_number:
            import uuid
            self.certificate_number = f"TM-{uuid.uuid4().hex[:10].upper()}"
        super().save(*args, **kwargs)
