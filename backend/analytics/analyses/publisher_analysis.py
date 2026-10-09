from .base import BaseAnalysis


class PublisherAnalysis(BaseAnalysis):
    key = 'publisher-analysis'
    title = 'Publisher Analysis'
    default_chart = 'horizontalBar'
    allowed_charts = ('horizontalBar', 'bar', 'pie')

    def analyse(self, frame, filters):
        top_n = max(1, min(self._int(filters.get('top_n')) or 10, 30))
        series = frame['book publisher'].fillna('Unknown').astype(str).replace('', 'Unknown').value_counts().head(top_n)
        labels = series.index.tolist()
        values = [int(v) for v in series.values.tolist()]
        leader = labels[0] if labels else '—'
        leader_count = values[0] if values else 0
        share = round((leader_count / len(frame) * 100), 1) if len(frame) else 0
        interpretation = (
            f'{leader} contributes the largest number of books in the current selection with {leader_count:,} records '
            f'({share:.1f}%). The visualization shows the top {len(labels)} publishers by book count.'
            if labels else 'No publisher records match the selected filters.'
        )
        return {
            'labels': labels,
            'datasets': [{'label': 'Books', 'data': values}],
            'summary': [
                {'label': 'Publishers shown', 'value': str(len(labels))},
                {'label': 'Leading publisher', 'value': leader},
                {'label': 'Leader books', 'value': f'{leader_count:,}'},
                {'label': 'Leader share', 'value': f'{share:.1f}%'},
            ],
            'table': [{'Publisher': label, 'Books': value} for label, value in zip(labels, values)],
            'interpretation': interpretation,
        }
