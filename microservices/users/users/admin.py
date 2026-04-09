from django.contrib import admin

from .models import Role, User


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'updated_at')
    search_fields = ('name',)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        'university_code',
        'first_name',
        'last_name',
        'email',
        'role',
        'is_active',
        'updated_at',
    )
    list_filter = ('role', 'is_active')
    search_fields = ('university_code', 'first_name', 'last_name', 'email')
