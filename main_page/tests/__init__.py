# from django.contrib.auth.models import User
# from django.core.urlresolvers import reverse
# from django.test import LiveServerTestCase
# from selenium import webdriver
# from selenium.webdriver.support.wait import WebDriverWait
#
#
# class MainPageTestCase(LiveServerTestCase):
#     def setUp(self):
#         self.b = webdriver.Firefox()
#         self.b.implicitly_wait(3)
#         self.wait = WebDriverWait(self.b, 10)
#         self.admin = User.objects.create_superuser("admin", "", "admin")
#
#     def tearDown(self):
#         self.b.quit()
#
#     def get(self, view):
#         self.b.get(self.live_server_url + reverse(view))
