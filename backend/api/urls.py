from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health, name='health'),
    path('datasets/sample/', views.sample_dataset, name='sample-dataset'),
    path('datasets/upload/', views.upload_dataset, name='upload-dataset'),
    path('datasets/<str:dataset_id>/metadata/', views.dataset_metadata, name='dataset-metadata'),
    path('analyses/<str:analysis_type>/', views.run_analysis, name='run-analysis'),
    path('reports/analysis/', views.download_report, name='download-report'),
]
