from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .serializers import UserSerializer


class UserDetailAPIView(APIView):
    """GET /api/v1/users/<uuid>/"""

    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        return Response(UserSerializer(user).data)


class UserResolveAPIView(APIView):
    """
    GET /api/v1/users/resolve/?university_code=<code>
    Used by other services to validate a user and obtain their id.
    """

    def get(self, request):
        code = request.query_params.get('university_code')
        if not code or not str(code).strip():
            return Response(
                {'detail': 'Query parameter university_code is required.'},
                status=400,
            )
        user = User.objects.filter(university_code__iexact=code.strip()).first()
        if not user:
            return Response({'detail': 'User not found.'}, status=404)
        return Response(UserSerializer(user).data)
