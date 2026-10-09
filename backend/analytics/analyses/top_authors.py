from .base import BaseAnalysis


class TopAuthorsAnalysis(BaseAnalysis):
    key = 'top-authors'
    title = 'Top Authors'
    default_chart = 'horizontalBar'
    allowed_charts = ('horizontalBar', 'bar', 'pie')

    def analyse(self, frame, filters):
        top_n = max(1, min(self._int(filters.get('top_n')) or 5, 25))
        series = frame['author'].fillna('Unknown').astype(str).replace('', 'Unknown').value_counts().head(top_n)
        labels = series.index.tolist()
        values = [int(v) for v in series.values.tolist()]
        leader = labels[0] if labels else '—'
        leader_count = values[0] if values else 0
        share = round((leader_count / len(frame) * 100), 1) if len(frame) else 0
        interpretation = (
            f'{leader} is the most prolific author in the current selection with {leader_count:,} books, '
            f'representing {share:.1f}% of the filtered records. The chart ranks the top {len(labels)} authors by publication count.'
            if labels else 'No author records match the selected filters.'
        )
        return {
            'labels': labels,
            'datasets': [{'label': 'Books', 'data': values}],
            'summary': [
                {'label': 'Authors shown', 'value': str(len(labels))},
                {'label': 'Leading author', 'value': leader},
                {'label': 'Leader books', 'value': f'{leader_count:,}'},
                {'label': 'Leader share', 'value': f'{share:.1f}%'},
            ],
            'table': [{'Author': label, 'Books': value} for label, value in zip(labels, values)],
            'interpretation': interpretation,
        }
