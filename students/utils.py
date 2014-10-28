from datetime import datetime
# import json
# from students.models import DisciplineMarksCache


def current_year():
    """
    :return: current learning year
    """
    now = datetime.now()
    if now.month < 9:  # if not september yet
        return now.year - 1
    return now.year


def current_semestr():
    now = datetime.now()
    if 2 <= now.month < 9:
        return 2
    return 1



