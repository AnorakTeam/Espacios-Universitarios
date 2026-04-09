from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Area, Space
from .serializers import SpaceSerializer


class SpaceDetailAPIView(APIView):
    """GET /api/v1/spaces/<uuid>/"""

    def get(self, request, pk):
        space = get_object_or_404(Space.objects.select_related('area'), pk=pk)
        return Response(SpaceSerializer(space).data)


class SpaceResolveAPIView(APIView):
    """
    GET /api/v1/spaces/resolve/?area_code=sb&code=401
    Used by other services to validate a space and obtain its id.
    """

    def get(self, request):
        area_code = request.query_params.get('area_code')
        code = request.query_params.get('code')
        if not area_code or not str(area_code).strip():
            return Response(
                {'detail': 'Query parameter area_code is required.'},
                status=400,
            )
        if not code or not str(code).strip():
            return Response(
                {'detail': 'Query parameter code is required.'},
                status=400,
            )
        area = Area.objects.filter(code__iexact=area_code.strip()).first()
        if not area:
            return Response({'detail': 'Area not found.'}, status=404)
        space = Space.objects.filter(
            area=area,
            code__iexact=code.strip(),
        ).select_related('area').first()
        if not space:
            return Response({'detail': 'Space not found.'}, status=404)
        return Response(SpaceSerializer(space).data)
