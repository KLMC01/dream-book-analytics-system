from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'dream-book-shop-development-key-change-me'

DEBUG = True


# Allowed domains
ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    ".vercel.app",
    "klmcstudios.pythonanywhere.com",
]


INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'api',
]


MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]


ROOT_URLCONF = 'dreambook.urls'

TEMPLATES = []

WSGI_APPLICATION = 'dreambook.wsgi.application'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Colombo'

USE_I18N = True

USE_TZ = True


STATIC_URL = 'static/'

STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# Frontend CORS access
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://dream-book-analytics-system.vercel.app",
    "https://dream-book-analytics-system-pu9yjajbq-klmc-studios.vercel.app",
]


# CSRF trusted frontend
CSRF_TRUSTED_ORIGINS = [
    "https://dream-book-analytics-system.vercel.app",
]


REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer'
    ],

    'DEFAULT_AUTHENTICATION_CLASSES': [],

    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny'
    ],

    'UNAUTHENTICATED_USER': None,

    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',
    ],
}


DATA_UPLOAD_MAX_MEMORY_SIZE = 25 * 1024 * 1024

FILE_UPLOAD_MAX_MEMORY_SIZE = 25 * 1024 * 1024