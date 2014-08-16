from django.db import transaction
from labs.models import TaskStudent
from students.models import Student


def users_for_task(task_id):
    return Student.objects.filter(taskstudent__taskex_id=task_id)

@transaction.atomic
def set_users_for_task(task_id, users_id):
    TaskStudent.objects.filter(taskex_id=task_id).delete()
    for user_id in users_id:
        t = TaskStudent(taskex_id=task_id, student_id=int(user_id))
        t.save()