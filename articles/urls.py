from django.conf.urls import patterns, url

urlpatterns = patterns('articles.views',
        url(r'ajax/article/save$', 'ajax.article.save'),
        url(r'ajax/article/upload_image$', 'ajax.article.upload_file'),
)
