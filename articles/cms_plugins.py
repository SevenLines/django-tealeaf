# coding:utf8

from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool
from filer.views import UploadFileForm

from articles.models import ArticlePluginModel, Article, UploadImageFileForm


__author__ = 'mick'


class ArticlePlugin(CMSPluginBase):
    model = ArticlePluginModel
    name = u"Статья"
    module = u"Статьи"
    render_template = "articles/plugin.html"
    cache = False

    def render(self, context, instance, placeholder):
        context['article'] = instance.raw
        context['is_draft'] = instance.page.publisher_is_draft
        context['form'] = UploadImageFileForm(initial={
            'pk': instance.pk,
        })
        return super(ArticlePlugin, self).render(context, instance, placeholder)


plugin_pool.register_plugin(ArticlePlugin)