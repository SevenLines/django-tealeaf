from django.db import models


class CustomCSS(models.Model):
    title = models.CharField(max_length=64)
    css = models.TextField(blank=True)
    enabled = models.BooleanField(default=False)

    @staticmethod
    def list():
        css = CustomCSS.objects.filter(enabled=True)
        return tuple( (str(c.title), str(c.title)) for c in css)