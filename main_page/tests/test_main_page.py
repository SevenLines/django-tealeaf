# # coding=utf-8
# from django.core.urlresolvers import reverse
# from django.test.testcases import LiveServerTestCase
# from selenium import webdriver
# from selenium.webdriver.common.action_chains import ActionChains
# from selenium.webdriver.common.by import By
# from selenium.webdriver.remote.webelement import WebElement
# from selenium.webdriver.support import expected_conditions as EC
#
# import time
# from main_page.tests import MainPageTestCase
#
# __author__ = 'm'
#
#
# class TestMainPage(MainPageTestCase):
#     def setUp(self):
#         super(TestMainPage, self).setUp()
#
#     def test_guest_can_login(self):
#         wait = 0.2
#
#         self.get('main_page.views.index')
#         enter_button = self.b.find_element_by_id("enter-button")
#         login_modal = self.b.find_element_by_id("login-modal")
#         self.assertEqual(login_modal.is_displayed(), False)
#
#         action = ActionChains(self.b)
#         action.move_to_element_with_offset(enter_button, -10, -10)
#         action.perform()
#         time.sleep(wait)
#         action.click(enter_button).perform()
#         time.sleep(wait)
#         self.assertEqual(login_modal.is_displayed(), True)
#
#         password = login_modal.find_element_by_name("password")
#         password.send_keys("admin")
#         time.sleep(wait)
#
#         username = login_modal.find_element_by_name("username")
#         username.send_keys("admin")
#         password = login_modal.find_element_by_name("password")
#         password.send_keys("admin")
#
#         username.submit()
#         time.sleep(wait)
#         body = self.b.find_element_by_tag_name("body")
#         self.assertNotIn(u"Неверная комбинация пользователь / пароль", body.text)
#
#     def test_guest_informed_that_he_provide_wrong_password(self):
#         wait = 0.2
#
#         self.get('main_page.views.index')
#         enter_button = self.b.find_element_by_id("enter-button")
#         login_modal = self.b.find_element_by_id("login-modal")
#         self.assertEqual(login_modal.is_displayed(), False)
#
#         action = ActionChains(self.b)
#         action.move_to_element_with_offset(enter_button, -10, -10)
#         action.perform()
#         time.sleep(wait)
#         action.click(enter_button).perform()
#         time.sleep(wait)
#         self.assertEqual(login_modal.is_displayed(), True)
#
#         password = login_modal.find_element_by_name("password")
#         password.send_keys("admin")
#         time.sleep(wait)
#
#         username = login_modal.find_element_by_name("username")
#         username.send_keys("admin")
#         password = login_modal.find_element_by_name("password")
#         password.send_keys("admin2")
#
#         username.submit()
#         time.sleep(wait)
#         body = self.b.find_element_by_tag_name("body")
#         self.assertIn(u"Неверная комбинация пользователь / пароль", body.text)
#
#
#
