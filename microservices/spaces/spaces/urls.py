from django.urls import path

from .api import SpaceDetailAPIView, SpaceResolveAPIView
from .views import api_test, hello_api

urlpatterns = [
    path('test/', api_test),
    path('hello/', hello_api),
    path('spaces/<uuid:pk>/', SpaceDetailAPIView.as_view()),
    path('spaces/resolve/', SpaceResolveAPIView.as_view()),
]