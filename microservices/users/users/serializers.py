from rest_framework import serializers

from .models import Role, User


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ('id', 'name', 'description')


class UserSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'university_code',
            'first_name',
            'last_name',
            'email',
            'role',
            'is_active',
            'created_at',
            'updated_at',
        )
        read_only_fields = fields
