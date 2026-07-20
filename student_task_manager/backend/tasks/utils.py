from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notification


def push_notification(user, message, task=None):
    notif = Notification.objects.create(user=user, task=task, message=message)
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"notifications_{user.id}",
        {
            "type": "send_notification",
            "data": {
                "id": notif.id,
                "message": notif.message,
                "created_at": notif.created_at.isoformat(),
                "is_read": notif.is_read,
                "task": notif.task_id,
            },
        },
    )
    return notif