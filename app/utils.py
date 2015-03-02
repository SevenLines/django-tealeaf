# coding=utf-8
import datetime
from django.contrib.auth.models import User
from django.db.models.fields.files import ImageFieldFile
from django.http import HttpResponseBadRequest
from django.test import TestCase


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


def get_post_object(request, Model):
    return Model.objects.get(pk=request.POST['id'])


def update_object(dict, obj, *permitted_keys):
    for key in permitted_keys:
        if key in dict:
            val = dict[key]
            if val == "false":
                val = False
            elif val == "true":
                val = True
            setattr(obj, key, val)


def update_post_object(request, Model, *permitted_keys):
    """
    Обновляет объект полями из request.POST, идентификатор объекта находится в id
    :param request: объект запроса
    :param Model: класс модели
    :param permited_keys: разрешенные для обновления поля
    :return: обновленный объект
    """
    obj = get_post_object(request, Model)
    update_object(request.POST, obj, *permitted_keys)
    obj.save()
    return obj


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


def add_cross_domain(http_response):
    """
    Adds cross domain access support to current response
    :param http_response:
    :return:
    """
    http_response["Access-Control-Allow-Origin"] = "*"
    http_response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    http_response["Access-Control-Max-Age"] = "1000"
    http_response["Access-Control-Allow-Headers"] = "*"
    return http_response


class MyTestCase(TestCase):
    password = '12345'

    def setUp(self):
        self.root = User.objects.create_superuser('root', 'mailm@mail.ru', self.password)

    @staticmethod
    def login(fn):
        def _wrapper(self=None):
            self.client.login(username=self.root.username, password=self.password)
            fn(self)
            self.client.logout()

        return _wrapper


