import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PWA_SERVICE_WORKER_PATH = os.path.join(BASE_DIR,"static/pwa/sw.js")
PWA_APP_NAME = "Tengeneza"
PWA_APP_DESCRIPTION = "Call a pro for your DIY."
PWA_APP_THEME_COLOR = '#008800'
PWA_APP_BACKGROUND_COLOR = '#008800'
PWA_APP_DISPLAY = 'standalone'
PWA_APP_START_URL = '/'
PWA_APP_ICONS = [
    {
      "src": "/static/images/icons/icon128x128.png",
        "sizes": "128x128",
        "type": "image/png"
      }, {
        "src": "/static/images/icons/icon144x144.png",
        "sizes": "144x144",
        "type": "image/png"
      }, {
        "src": "/static/images/icons/icon152x152.png",
        "sizes": "152x152",
        "type": "image/png"
      }, {
        "src": "/static/images/icons/icon192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      }, {
        "src": "/static/images/icons/icon256x256.png",
        "sizes": "256x256",
        "type": "image/png"
      }, {
        "src": "/static/images/icons/icon512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
]
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '+wvj%y)$*op!5a&$%-ju!ttu0!_vj#cd$#n%jc-o3c4te+uoaq'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['tengeneza.kipya-africa.com','127.0.0.1']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'caller.apps.CallerConfig',
    'calls.apps.CallsConfig',
    'fundi.apps.FundiConfig',
    'shop.apps.ShopConfig',
    'django.contrib.humanize',
    'pwa'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'tengeneza.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR,"templates")],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'tengeneza.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'tengeneza',
        'USER': 'kipyadev',
        'PASSWORD': 'Kipya2010$',
        'HOST': '34.66.81.20',   # Or an IP Address that your DB is hosted on
        'PORT': '3306',
    }
}



# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = '/static/'
# STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]
STATIC_ROOT =  os.path.join(BASE_DIR, "static")

LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'

MEDIA_URL='/media/'
MEDIA_ROOT=os.path.join(BASE_DIR,"media")