# coding=utf-8
import json
import os
from django.core.urlresolvers import reverse
from app.utils import MyTestCase
from main_page.models import MainPageItem, MainPage


class TestMainPage(MyTestCase):

    def setUp(self):
        super(TestMainPage, self).setUp()
        self.activeItem = MainPageItem.objects.create()
        self.item2 = MainPageItem.objects.create()
        self.item3 = MainPageItem.objects.create()

        obj = MainPage.solo()
        obj.current_item = self.activeItem
        obj.save()

    def test_anyone_can_see_main_page(self):
        response = self.client.get(reverse('main_page.views.index'))
        self.assertEqual(response.status_code, 200)

    def test_guest_cant_see_item(self):
        response = self.client.get(reverse('main_page.views.item'))
        self.assertEqual(response.status_code, 302)

    @MyTestCase.login
    def test_item_without_parameters_returns_current_item(self):
        obj = MainPage.solo()
        obj.current_item = self.activeItem
        obj.save()

        response = self.client.get(reverse('main_page.views.item'))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)

        self.assertEqual(data['item']['id'], self.activeItem.id)

    @MyTestCase.login
    def test_item_with_web_should_have_video_tag_on_page(self):
         with open('tests/test_output.webm') as fp:
            new_values = {
                'title': 'new_title2312123',
                'description': 'new_description12312123',
                'file': fp
            }
            response = self.can_post('main_page.views.add_item', new_values)

            item = MainPageItem.objects.filter(title=new_values['title'], description=new_values['description'])
            self.assertEqual(item.count(), 1)
            item = item.first()

            response = self.can_get('main_page.views.item', {
                'item_id': item.id
            })
            data = json.loads(response.content)
            self.assertTrue(data['html'].find('video'))
            self.assertTrue(data['html'].find('src="%s"' % item.video.path))

    @MyTestCase.login
    def test_item_with_image_should_have_image_tag_on_page(self):
         with open('tests/test_image.png') as fp:
            new_values = {
                'title': 'new_title2312123',
                'description': 'new_description12312123',
                'file': fp
            }
            response = self.can_post('main_page.views.add_item', new_values)

            item = MainPageItem.objects.filter(title=new_values['title'], description=new_values['description'])
            self.assertEqual(item.count(), 1)
            item = item.first()

            response = self.can_get('main_page.views.item', {
                'item_id': item.id
            })
            data = json.loads(response.content)
            self.assertTrue(data['html'].find('img'))
            self.assertTrue(data['html'].find('src="%s"' % item.img.path))

    @MyTestCase.login
    def test_item_with_parameters_return_requested_item(self):
        response = self.client.get(reverse('main_page.views.item'), {
            'item_id': self.item2.id
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)

        self.assertEqual(data['item']['id'], self.item2.id)

    @MyTestCase.login
    def test_item_without_parameters_without_active_item_returns_none(self):
        obj = MainPage.solo()
        obj.current_item = None
        obj.save()

        response = self.client.get(reverse('main_page.views.item'))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)

        self.assertEqual(data['item'], None)

    def test_guest_cant_list_items(self):
        response = self.client.get(reverse('main_page.views.list_items'))
        self.assertEqual(response.status_code, 302)

    @MyTestCase.login
    def test_list_items_returns_all_items(self):
        MainPageItem.objects.create()
        MainPageItem.objects.create()
        MainPageItem.objects.create()
        MainPageItem.objects.create()

        response = self.client.get(reverse('main_page.views.list_items'))
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content)
        self.assertEqual(len(data), MainPageItem.objects.count())

    @MyTestCase.login
    def test_list_items_return_array_with_active_item_marked_as_active(self):
        obj = MainPage.solo()
        obj.current_item = self.activeItem
        obj.save()

        response = self.client.get(reverse('main_page.views.list_items'))
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content)
        self.assertEqual(len(data), MainPageItem.objects.count())

        current_item = MainPage.solo().current_item
        for i in data:
            self.assertEqual(i['active'], i['id'] == current_item.id)

    def test_guest_cant_see_themes(self):
        response = self.client.get(reverse('main_page.views.list_themes'))
        self.assertEqual(response.status_code, 302)

    @MyTestCase.login
    def test_list_themes_contains_default_inactive_theme(self):
        response = self.client.get(reverse('main_page.views.list_themes'))
        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content)
        for i in data:
            self.assertIn('name', i)
            self.assertIn('path', i)
            self.assertIn('current', i)

        self.assertEqual(data[0]['name'], u'без темы')

    def test_guest_cant_set_current_theme(self):
        obj = MainPage.solo()
        obj.current_theme_css = 'not_test_theme'
        obj.save()

        response = self.client.post(reverse('main_page.views.set_current_theme'), {
            'css_path': 'test_theme'
        })
        self.assertEqual(response.status_code, 302)

    @MyTestCase.login
    def test_set_current_theme_updates_mainpage_current_theme(self):
        obj = MainPage.solo()
        obj.current_theme_css = 'not_test_theme'
        obj.save()

        response = self.client.post(reverse('main_page.views.set_current_theme'), {
            'css_path': 'test_theme'
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(MainPage.solo().current_theme_css, 'test_theme')

    def test_guest_cant_update_current_item(self):
        obj = MainPage.solo()
        obj.current_item = None
        obj.save()

        response = self.client.post(reverse('main_page.views.set_active'), {
            'item_id': self.activeItem.id
        })
        self.assertEqual(response.status_code, 302)

    @MyTestCase.login
    def test_update_item_changes_current_item(self):
        obj = MainPage.solo()
        obj.current_item = None
        obj.save()

        response = self.client.post(reverse('main_page.views.set_active'), {
            'item_id': self.activeItem.id
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(MainPage.solo().current_item, self.activeItem)

    def test_guest_cant_save_item(self):
        response = self.client.post(reverse('main_page.views.save_item'), {
            'item_id': self.activeItem.id
        })
        self.assertEqual(response.status_code, 302)

    @MyTestCase.login
    def test_save_item_updates_items_values(self):
        item = MainPageItem.objects.create()

        new_values = {
            'item_id': item.id,
            'title': 'new_title',
            'description': 'new_description'
        }

        response = self.client.post(reverse('main_page.views.save_item'), new_values)
        self.assertEqual(response.status_code, 200)

        item = MainPageItem.objects.get(id=item.id)
        self.assertEqual(item.description, new_values['description'])
        self.assertEqual(item.title, new_values['title'])

    def test_guest_cant_add_item(self):
        self.cant_post('main_page.views.add_item', {
            'title': 'new_title',
            'description': 'new_description',
        })

    @MyTestCase.login
    def test_add_item_should_add_new_item(self):
        with open('tests/test_image.png') as fp:
            new_values = {
                'title': 'new_title2312',
                'description': 'new_description12312',
                'file': fp
            }
            response = self.can_post('main_page.views.add_item', new_values)

            item = MainPageItem.objects.filter(title=new_values['title'], description=new_values['description'])
            self.assertEqual(item.count(), 1)
            item = item.first()
            assert isinstance(item, MainPageItem)
            self.assertEqual(item.title, new_values['title'])
            self.assertEqual(item.description, new_values['description'])
            self.assertTrue(os.path.exists(item.img.path))

    @MyTestCase.login
    def test_add_item_should_save_webm(self):
        with open('tests/test_output.webm') as fp:
            new_values = {
                'title': 'new_title2312123',
                'description': 'new_description12312123',
                'file': fp
            }
            response = self.can_post('main_page.views.add_item', new_values)

            item = MainPageItem.objects.filter(title=new_values['title'], description=new_values['description'])
            self.assertEqual(item.count(), 1)
            item = item.first()

            assert isinstance(item, MainPageItem)

            self.assertEqual(item.title, new_values['title'])
            self.assertEqual(item.description, new_values['description'])
            print item.video.path
            print item.video.thumbnail_path
            self.assertTrue(os.path.exists(item.video.path))
            self.assertTrue(os.path.exists(item.video.thumbnail_path))

    def test_user_cant_remove_item(self):
        item = MainPageItem.objects.create()
        self.cant_post('main_page.views.remove_item', {
            'item_id': item.id
        })

    @MyTestCase.login
    def test_remove_item_should_remove_item(self):
        with open('tests/test_image.png') as fp:
            new_values = {
                'title': 'new_title2312',
                'description': 'new_description12312',
                'file': fp
            }
            response = self.can_post('main_page.views.add_item', new_values)
            item = MainPageItem.objects.order_by('-pk')[0]

            self.assertTrue(os.path.exists(item.img.path))
        path = item.img.path
        self.can_post('main_page.views.remove_item', {
            'item_id': item.id
        })
        self.assertFalse(os.path.exists(path))
        self.assertEqual(MainPageItem.objects.filter(id=item.id).count(), 0)

        # check for webm format
        with open('tests/test_output.webm') as fp:
            new_values = {
                'title': 'new_title2312g',
                'description': 'new_description12312g',
                'file': fp
            }
            response = self.can_post('main_page.views.add_item', new_values)
            item = MainPageItem.objects.order_by('-pk')[0]
            self.assertTrue(os.path.exists(item.video.path))
            self.assertTrue(os.path.exists(item.video.thumbnail_path))

        path = item.video.path
        self.can_post('main_page.views.remove_item', {
            'item_id': item.id
        })

        self.assertFalse(os.path.exists(path))
        self.assertFalse(os.path.exists(item.video.thumbnail_path))
        self.assertEqual(MainPageItem.objects.filter(id=item.id).count(), 0)

    def test_guest_cant_toggle_border(self):
        self.cant_post('main_page.views.toggle_border', {
            'show_border': 'false'
        })

    @MyTestCase.login
    def test_toggle_border_should_set_border(self):
        obj = MainPage.solo()
        obj.show_border = False
        obj.save()

        self.can_post('main_page.views.toggle_border', {
            'show_border': 'true'
        })
        self.assertEqual(MainPage.solo().show_border, True)

        self.can_post('main_page.views.toggle_border', {
            'show_border': 'false'
        })
        self.assertEqual(MainPage.solo().show_border, False)

    def test_guest_cant_change_img_bootstrap_cols(self):
        self.cant_post('main_page.views.toggle_img_bootstrap_cols', {
            'img_bootstrap_cols': 8
        })


    @MyTestCase.login
    def test_change_img_bootstrap_cols_should_change_img_bootstrap_cols(self):
        obj = MainPage.solo()
        obj._img_bootstrap_cols = 0
        obj.save()

        self.can_post('main_page.views.toggle_img_bootstrap_cols', {
            'img_bootstrap_cols': 7
        })

        self.assertEqual( MainPage.solo()._img_bootstrap_cols, 7)

    def test_guest_cant_update_description(self):
        self.cant_post('main_page.views.update_description', {
            'description': 'ultra_description'
        })

    @MyTestCase.login
    def test_update_description_should_update(self):
        obj = MainPage.solo()
        obj.description = ''
        obj.save()

        self.can_post('main_page.views.update_description', {
            'description': u'ЗДРАВСТВУЙ!'
        })

        self.assertEqual(MainPage.solo().description, u'ЗДРАВСТВУЙ!')