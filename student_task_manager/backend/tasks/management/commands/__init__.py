from django.core.management.base import BaseCommand
from django.utils import timezone
from tasks.models import Task
from tasks.utils import push_notification

class Command(BaseCommand):
    help = "Notifies users when a task's deadline has passed"

    def handle(self, *args, **options):
        now = timezone.localtime()
        tasks = Task.objects.filter(
            status__in=["Pending", "In Progress"],
            deadline_notified=False,
            due_date__isnull=False,
        )
        count = 0
        for task in tasks:
            deadline_time = task.due_time or timezone.datetime.min.time()
            deadline = timezone.make_aware(timezone.datetime.combine(task.due_date, deadline_time))
            if now >= deadline:
                push_notification(task.user, f'"{task.title}" deadline has passed.', task=task)
                task.deadline_notified = True
                task.save()
                count += 1
        self.stdout.write(f"Sent {count} notification(s)")