# coding=utf-8
import json
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
