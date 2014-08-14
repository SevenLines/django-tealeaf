from students.models import Student


def users_for_task(task_id):
    return Student.objects.filter(taskstudent__taskex_id=task_id)