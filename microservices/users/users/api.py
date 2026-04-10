"""
API del microservicio Users.

Endpoints implementados:
  HU-01  POST   /api/v1/auth/register           — Registro de nuevos usuarios
  HU-02  POST   /api/v1/auth/login              — Inicio de sesión (JWT)
  HU-03  POST   /api/v1/auth/logout             — Cierre de sesión (invalida refresh token)
  HU-04  POST   /api/v1/auth/password-recovery  — Solicitud de recuperación de contraseña
  HU-05  PATCH  /api/v1/users/me/               — Edición de perfil propio

  Internos (consumidos por otros microservicios):
         GET    /api/v1/users/<uuid>/            — Detalle de usuario por ID
         GET    /api/v1/users/resolve/           — Resolución por university_code o email
"""

from __future__ import annotations

import logging

from django.db import transaction
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .auth import (
    generate_access_token,
    get_authenticated_user,
    hash_password,
    verify_password,
)
from .models import Role, User, UserSession
from .serializers import (
    LoginSerializer,
    RegisterSerializer,
    UpdateProfileSerializer,
    UserPublicSerializer,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_client_ip(request) -> str | None:
    """Extrae la IP real del cliente, considerando proxies."""
    forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    if forwarded:
        return forwarded.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


def _build_auth_response(user: User, ip: str | None) -> dict:
    """Crea access + refresh token y registra la sesión."""
    access_token = generate_access_token(str(user.id))
    session = UserSession.create_for_user(
        user=user,
        ip_address=ip,
        expire_days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS,
    )
    return {
        'access_token': access_token,
        'refresh_token': session.refresh_token,
        'token_type': 'Bearer',
        'expires_in': settings.JWT_ACCESS_TOKEN_EXPIRE_HOURS * 3600,
        'user': UserPublicSerializer(user).data,
    }


# ---------------------------------------------------------------------------
# HU-01 — Registro
# ---------------------------------------------------------------------------

class RegisterAPIView(APIView):
    """POST /api/v1/auth/register"""

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=400)

        data = serializer.validated_data

        # Determinar rol: role_name > role_id > 'Estudiante' por defecto
        role_name = data.get('role_name')
        role_id = data.get('role_id')

        # Admin no puede asignarse desde el registro público
        FORBIDDEN_ROLES = {'admin'}

        if role_name:
            if role_name.lower() in FORBIDDEN_ROLES:
                role_name = 'Estudiante'
            role = Role.objects.filter(name__iexact=role_name).first()
            if not role:
                return Response({'detail': f'El rol "{role_name}" no existe.'}, status=400)
        elif role_id:
            role = Role.objects.filter(pk=role_id).first()
            if not role:
                return Response({'detail': f'El rol con id={role_id} no existe.'}, status=400)
        else:
            role = Role.objects.filter(name='Estudiante').first()
            if not role:
                return Response(
                    {'detail': 'No existe el rol "Estudiante". Ejecuta el seed de roles primero.'},
                    status=500,
                )

        with transaction.atomic():
            user = User.objects.create(
                email=data['email'],
                university_code=data['university_code'],
                password_hash=hash_password(data['password']),
                first_name=data['first_name'],
                last_name=data['last_name'],
                role=role,
            )

        logger.info('Usuario registrado: %s (%s)', user.university_code, user.email)

        ip = _get_client_ip(request)
        auth_data = _build_auth_response(user, ip)

        return Response(auth_data, status=201)


# ---------------------------------------------------------------------------
# HU-02 — Login
# ---------------------------------------------------------------------------

class LoginAPIView(APIView):
    """POST /api/v1/auth/login"""

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=400)

        login_value = serializer.validated_data['login'].strip()
        password = serializer.validated_data['password']

        # Buscar por email o código universitario
        user = (
            User.objects.select_related('role')
            .filter(email__iexact=login_value)
            .first()
            or User.objects.select_related('role')
            .filter(university_code__iexact=login_value)
            .first()
        )

        if not user:
            return Response(
                {'detail': 'Credenciales inválidas.'},
                status=401,
            )

        if not user.is_active:
            return Response(
                {'detail': 'Tu cuenta está desactivada. Contacta al administrador.'},
                status=403,
            )

        if not verify_password(password, user.password_hash):
            return Response(
                {'detail': 'Credenciales inválidas.'},
                status=401,
            )

        # Limpiar sesiones expiradas del usuario antes de crear una nueva
        UserSession.objects.filter(user=user, expires_at__lt=timezone.now()).delete()

        ip = _get_client_ip(request)
        auth_data = _build_auth_response(user, ip)

        logger.info('Login exitoso: %s desde %s', user.university_code, ip)

        return Response(auth_data, status=200)


# ---------------------------------------------------------------------------
# HU-03 — Logout
# ---------------------------------------------------------------------------

class LogoutAPIView(APIView):
    """POST /api/v1/auth/logout"""

    def post(self, request):
        user, error = get_authenticated_user(request)
        if error:
            return error

        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return Response(
                {'detail': 'Se requiere el refresh_token en el cuerpo de la petición.'},
                status=400,
            )

        deleted, _ = UserSession.objects.filter(
            user=user,
            refresh_token=refresh_token,
        ).delete()

        if deleted == 0:
            return Response(
                {'detail': 'Sesión no encontrada o ya cerrada.'},
                status=404,
            )

        logger.info('Logout: usuario %s cerró sesión.', user.university_code)

        return Response({'detail': 'Sesión cerrada exitosamente.'}, status=200)


# ---------------------------------------------------------------------------
# HU-04 — Recuperación de contraseña
# ---------------------------------------------------------------------------

class PasswordRecoveryAPIView(APIView):
    """
    POST /api/v1/auth/password-recovery

    En producción, este endpoint publicaría un evento a RabbitMQ para que
    el microservicio de Notificaciones envíe el correo de recuperación.
    Por ahora retorna un token de recuperación directamente (solo en DEBUG).
    """

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        if not email:
            return Response({'detail': 'Se requiere el campo email.'}, status=400)

        user = User.objects.filter(email__iexact=email, is_active=True).first()

        # Siempre responder con 200 para no revelar si el email existe (seguridad)
        base_response = {
            'detail': (
                'Si el correo está registrado, recibirás un enlace de recuperación. '
                'Revisa tu bandeja de entrada.'
            )
        }

        if not user:
            return Response(base_response, status=200)

        # Generar token de recuperación temporal (válido 1 hora)
        recovery_token = generate_access_token(str(user.id))

        # TODO: publicar evento ResetPasswordRequested → Notifications MS (RabbitMQ)
        # Por ahora, en modo DEBUG se retorna el token para pruebas
        if settings.DEBUG:
            base_response['debug_reset_token'] = recovery_token
            base_response['debug_note'] = (
                'Este campo solo aparece en modo DEBUG. '
                'En producción se enviaría por email.'
            )

        logger.info('Recuperación de contraseña solicitada para: %s', email)

        return Response(base_response, status=200)


# ---------------------------------------------------------------------------
# HU-05 — Edición de perfil
# ---------------------------------------------------------------------------

class UpdateProfileAPIView(APIView):
    """PATCH /api/v1/users/me/"""

    def patch(self, request):
        user, error = get_authenticated_user(request)
        if error:
            return error

        serializer = UpdateProfileSerializer(
            data=request.data,
            context={'user': user},
        )
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=400)

        data = serializer.validated_data
        updated_fields = []

        if 'first_name' in data:
            user.first_name = data['first_name']
            updated_fields.append('first_name')
        if 'last_name' in data:
            user.last_name = data['last_name']
            updated_fields.append('last_name')
        if 'email' in data:
            user.email = data['email']
            updated_fields.append('email')

        if not updated_fields:
            return Response(
                {'detail': 'No se enviaron campos para actualizar.'},
                status=400,
            )

        user.save(update_fields=updated_fields + ['updated_at'])

        logger.info(
            'Perfil actualizado para %s: %s',
            user.university_code,
            ', '.join(updated_fields),
        )

        return Response(UserPublicSerializer(user).data, status=200)

    def get(self, request):
        """GET /api/v1/users/me/ — devuelve el perfil del usuario autenticado."""
        user, error = get_authenticated_user(request)
        if error:
            return error
        return Response(UserPublicSerializer(user).data, status=200)


# ---------------------------------------------------------------------------
# Endpoints internos (consumidos por otros microservicios)
# ---------------------------------------------------------------------------

class UserDetailAPIView(APIView):
    """GET /api/v1/users/<uuid>/"""

    def get(self, request, pk):
        user = get_object_or_404(User.objects.select_related('role'), pk=pk)
        return Response(UserPublicSerializer(user).data)


class UserResolveAPIView(APIView):
    """
    GET /api/v1/users/resolve/?university_code=<code>
    GET /api/v1/users/resolve/?email=<email>

    Usado por otros microservicios (ej: Reservations) para validar
    la identidad de un usuario y obtener su UUID.
    """

    def get(self, request):
        code = request.query_params.get('university_code', '').strip()
        email = request.query_params.get('email', '').strip()

        if not code and not email:
            return Response(
                {'detail': 'Se requiere university_code o email como parámetro de consulta.'},
                status=400,
            )

        qs = User.objects.select_related('role')

        if code:
            user = qs.filter(university_code__iexact=code).first()
        else:
            user = qs.filter(email__iexact=email).first()

        if not user:
            return Response({'detail': 'Usuario no encontrado.'}, status=404)

        return Response(UserPublicSerializer(user).data)


# ---------------------------------------------------------------------------
# Endpoint de salud
# ---------------------------------------------------------------------------

@api_view(['GET'])
def health_check(request):
    return Response({'status': 'ok', 'service': 'users'})
