import uuid

from django.core.exceptions import ValidationError
from django.db import models


class Role(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=64, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self) -> str:
        return self.name


class User(models.Model):
    """
    Domain user record for the Users microservice (no auth integration yet).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    university_code = models.CharField(max_length=32, unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True, null=True, blank=True)
    role = models.ForeignKey(
        Role,
        on_delete=models.PROTECT,
        related_name='users',
    )
    is_active = models.BooleanField(
        default=True,
        help_text='When false, the account is logically deactivated.',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['university_code']
        indexes = [
            models.Index(fields=['role', 'is_active']),
        ]

    def __str__(self) -> str:
        return f'{self.university_code} — {self.first_name} {self.last_name}'

    def clean(self) -> None:
        super().clean()
        if self.university_code and not self.university_code.strip():
            raise ValidationError({'university_code': 'University code cannot be blank.'})
        if self.first_name and not self.first_name.strip():
            raise ValidationError({'first_name': 'First name cannot be blank.'})
        if self.last_name and not self.last_name.strip():
            raise ValidationError({'last_name': 'Last name cannot be blank.'})
