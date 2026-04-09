from rest_framework import serializers

from .models import Area, Space


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ('id', 'code', 'name', 'description', 'sort_order')


class SpaceSerializer(serializers.ModelSerializer):
    area = AreaSerializer(read_only=True)

    class Meta:
        model = Space
        fields = (
            'id',
            'area',
            'code',
            'name',
            'floor',
            'capacity',
            'has_air_conditioning',
            'has_computers',
            'has_projector',
            'has_internet',
            'amenities',
            'status',
            'created_at',
            'updated_at',
        )
        read_only_fields = fields
