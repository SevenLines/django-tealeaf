# coding=utf-8
import datetime
from django.db.models.fields.files import ImageFieldFile
from django.http import HttpResponseBadRequest


def require_in_POST(*items):
    def decorator(func):
        def wrapper(request):
            err = ""
            for item in items:
                if item not in request.POST:
                    err += "'%s' is not defined\n" % item
            if err:
                return HttpResponseBadRequest(err)
            return func(request)

        return wrapper

    return decorator


def require_in_GET(*items):
    def decorator(func):
        def wrapper(request):
            err = ""
            for item in items:
                if item not in request.GET:
                    err += "'%s' is not defined\n" % item
            if err:
                return HttpResponseBadRequest(err)
            return func(request)

        return wrapper

    return decorator


def update_post_object(request, Model, *permited_keys):
    """
    Обновляет объект полями из request.POST, идентификатор объекта находится в id
    :param request: объект запроса
    :param Model: класс модели
    :param permited_keys: разрешенные для обновления поля
    :return:
    """
    obj = Model.objects.get(pk=request.POST['id'])
    for key in permited_keys:
        if key in request.POST:
            setattr(obj, key, request.POST[key])
    obj.save()


def json_encoder(obj):
    """
    handler for json.dumps to convert datatime to isoformat
    use like this

    json.dumps(datetime.datetime.now(), default=json_dthandler)

    :param obj:
    :return:
    """
    if isinstance(obj, datetime.datetime) or isinstance(obj, datetime.date):
        return obj.isoformat()
    if isinstance(obj, ImageFieldFile):
        try:
            return obj.url
        except ValueError as e:
            return ''
    return None


def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]