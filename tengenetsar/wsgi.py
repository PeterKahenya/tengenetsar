import os
import sys

from django.core.wsgi import get_wsgi_application
sys.path.append('/home/peter/projects/tengenetsarbeta')
sys.path.append('/home/peter/projects/tengenetsarbeta/tengenetsar')


os.environ["DJANGO_SETTINGS_MODULE"] = "tengenetsar.settings"


application = get_wsgi_application()
