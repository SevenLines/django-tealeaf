from app.utils import MyTestCase


class TestCommon(MyTestCase):
    def setUp(self):
        super(TestCommon, self).setUp()

    def test_404_page_should_exists(self):
        response = self.client.get("some/not/existent/way")
        self.assertEqual(response.status_code, 404)
