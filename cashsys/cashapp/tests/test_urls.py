from django.test import SimpleTestCase
from django.urls import reverse, resolve
from django.contrib.auth.models import User
from cashapp.views.views import RecordModify, AccountModify, PlanModify
from authsys.models import UserProfile


# testing url-CBV resolving success status
class TestUrls(SimpleTestCase):

    def test_url_resolved_record(self):
        """
        Test the successful resolvation status of /app/record url 
        """
        url = reverse("recordViews")
        # assert 1==2
        self.assertEquals(resolve(url).func.view_class, RecordModify)

    def test_url_resolved_plan(self):
        """
        Test the successful resolvation status of /app/plan url 
        """
        url = reverse("planViews")
        # assert 1==2
        self.assertEquals(resolve(url).func.view_class, PlanModify)

    def test_url_resolved_account(self):
        """
        Test the successful resolvation status of /app/account url 
        """
        url = reverse("accountViews") # reverse for url from its name in urls.py
        # assert 1==2
        self.assertEquals(resolve(url).func.view_class, AccountModify)
