import os
import sys

from django.core.wsgi import get_wsgi_application
sys.path.append('/home/peter/projects/tengeneza')
sys.path.append('/home/peter/projects/tengeneza/tengeneza')


os.environ["DJANGO_SETTINGS_MODULE"] = "tengeneza.settings"


application = get_wsgi_application()
