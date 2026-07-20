"""
ASGI config for student_task_manager project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from tasks.jwt_middleware import JWTAuthMiddleware
import tasks.routing
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'student_task_manager.settings')

django_asgi_app= get_asgi_application()
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddleware(
        URLRouter(tasks.routing.websocket_urlpatterns)
    ),
})