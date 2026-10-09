from .base import BaseAnalysis


class LanguageDistributionAnalysis(BaseAnalysis):
    key = 'language-distribution'
    title = 'Language Distribution'
    default_chart = 'doughnut'
    allowed_charts = ('doughnut', 'pie', 'bar')

    def analyse(self, frame, filters):
        series = frame['language'].fillna('Unknown').astype(str).replace('', 'Unknown').value_counts()
        labels = series.index.tolist()
        values = [int(v) for v in series.values.tolist()]
        dominant = labels[0] if labels else '—'
        dominant_count = values[0] if values else 0
        share = round((dominant_count / len(frame) * 100), 1) if len(frame) else 0
        interpretation = (
            f'{dominant} is the most represented language with {dominant_count:,} books ({share:.1f}% of the selection). '
            f'The filtered data contains {len(labels)} distinct language values.'
            if labels else 'No language records match the selected filters.'
        )
        return {
            'labels': labels,
            'datasets': [{'label': 'Books', 'data': values}],
            'summary': [
                {'label': 'Languages', 'value': str(len(labels))},
                {'label': 'Dominant language', 'value': dominant},
                {'label': 'Books in dominant language', 'value': f'{dominant_count:,}'},
                {'label': 'Dominant share', 'value': f'{share:.1f}%'},
            ],
            'table': [{'Language': label, 'Books': value} for label, value in zip(labels, values)],
            'interpretation': interpretation,
        }
