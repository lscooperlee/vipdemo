
from django.conf.urls import include, url

urlpatterns = [
    url('^$', 'vipdemo.views.demo_home'),
    url('testData.json', 'vipdemo.views.test_data'),
]
    
