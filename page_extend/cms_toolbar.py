from django.core.urlresolvers import reverse, NoReverseMatch
from django.utils.translation import ugettext_lazy as _

from cms.api import get_page_draft
from cms.toolbar_pool import toolbar_pool
from cms.toolbar_base import CMSToolbar
from page_extend.models import PageExtend


@toolbar_pool.register
class PageTagsToolbar(CMSToolbar):
    def populate(self):
        # always use draft if we have a page
        self.page = get_page_draft(self.request.current_page)

        if not self.page:
            return  # Nothing to do

        page_tag = PageExtend.objects.filter(extended_object_id=self.page.id).first()

        try:
            if page_tag:
                url = reverse('admin:page_extend_pageextend_change', args=(page_tag.pk,))
            else:
                url = reverse('admin:page_extend_pageextend_add') + '?extended_object=%s' % self.page.pk
        except NoReverseMatch:
            pass
        else:
            not_edit_mode = not self.toolbar.edit_mode
            current_page_menu = self.toolbar.get_or_create_menu('page')
            current_page_menu.add_modal_item(_('Extend options...'), url=url, disabled=not_edit_mode)