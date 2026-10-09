from pathlib import Path
from urllib.parse import quote

from django.conf import settings
from django.http import HttpResponse
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

from analytics.exceptions import DatasetError, AnalysisError
from analytics.storage import DatasetStorage
from analytics.loader import DatasetLoader
from analytics.metadata import MetadataService
from analytics.factory import AnalysisFactory
from analytics.report_service import ReportService

storage = DatasetStorage(Path(settings.BASE_DIR))
loader = DatasetLoader()
metadata_service = MetadataService()
factory = AnalysisFactory()
report_service = ReportService()


def _metadata(dataset_id, filename=None, is_sample=False):
    frame = storage.load(dataset_id)
    if filename is None:
        filename = storage.filename_for(dataset_id)
    return metadata_service.build(frame, dataset_id=dataset_id, filename=filename, is_sample=is_sample)


@api_view(['GET'])
def health(request):
    return Response({'status': 'ok', 'service': 'Dream Book Shop API'})


@api_view(['GET'])
def sample_dataset(request):
    try:
        return Response(_metadata('sample', filename='Dataset Books.csv', is_sample=True))
    except DatasetError as exc:
        return Response({'detail': str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_dataset(request):
    uploaded_file = request.FILES.get('file')
    if not uploaded_file:
        return Response({'detail': 'Choose a dataset file first.'}, status=status.HTTP_400_BAD_REQUEST)
    if uploaded_file.size > 25 * 1024 * 1024:
        return Response({'detail': 'The file is too large. Maximum upload size is 25 MB.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        frame = loader.load_upload(uploaded_file)
        dataset_id = storage.save(frame, uploaded_file.name)
        metadata = metadata_service.build(frame, dataset_id=dataset_id, filename=uploaded_file.name, is_sample=False)
        return Response(metadata, status=status.HTTP_201_CREATED)
    except DatasetError as exc:
        return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def dataset_metadata(request, dataset_id):
    try:
        return Response(_metadata(dataset_id, is_sample=(dataset_id == 'sample')))
    except DatasetError as exc:
        return Response({'detail': str(exc)}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def run_analysis(request, analysis_type):
    dataset_id = request.query_params.get('dataset_id', 'sample')
    filters = request.query_params.dict()
    filters.pop('dataset_id', None)
    try:
        frame = storage.load(dataset_id)
        analysis = factory.create(analysis_type)
        result = analysis.execute(frame, filters)
        return Response(result)
    except (DatasetError, AnalysisError) as exc:
        return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def download_report(request):
    dataset_id = request.data.get('dataset_id', 'sample')
    analysis_type = request.data.get('analysis_type')
    filters = request.data.get('filters') or {}
    chart_type = request.data.get('chart_type') or 'bar'
    try:
        frame = storage.load(dataset_id)
        analysis = factory.create(analysis_type)
        result = analysis.execute(frame, filters)
        metadata = _metadata(dataset_id, is_sample=(dataset_id == 'sample'))
        pdf = report_service.build_pdf(result, filename=metadata['filename'], filters=filters, chart_type=chart_type)
        response = HttpResponse(pdf, content_type='application/pdf')
        safe_name = analysis_type.replace('_', '-').replace('/', '-')
        response['Content-Disposition'] = f'attachment; filename="dream-book-shop-{safe_name}-report.pdf"'
        return response
    except (DatasetError, AnalysisError) as exc:
        return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
