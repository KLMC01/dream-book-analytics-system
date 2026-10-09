import pandas as pd
from .base import BaseAnalysis


class PublicationTrendsAnalysis(BaseAnalysis):
    key = 'publication-trends'
    title = 'Publication Trends Over Time'
    default_chart = 'line'
    allowed_charts = ('line', 'bar')

    def analyse(self, frame: pd.DataFrame, filters: dict) -> dict:
        years = pd.to_numeric(frame['publication date'], errors='coerce').dropna().astype(int)
        counts = years.value_counts().sort_index()
        labels = [str(x) for x in counts.index.tolist()]
        values = [int(x) for x in counts.values.tolist()]
        if values:
            peak_index = values.index(max(values))
            peak_year = labels[peak_index]
            peak_count = values[peak_index]
            avg = round(sum(values) / len(values), 1)
            trend = values[-1] - values[0] if len(values) > 1 else 0
            direction = 'increased' if trend > 0 else 'decreased' if trend < 0 else 'remained stable'
            interpretation = (
                f'{sum(values):,} books fall within the selected period. Publication activity peaked in {peak_year} '
                f'with {peak_count:,} books. Comparing the first and last visible years, publication volume {direction} '
                f'by {abs(trend):,} books.'
            )
        else:
            peak_year, peak_count, avg = '—', 0, 0
            interpretation = 'No publication records match the selected filters.'
        return {
            'labels': labels,
            'datasets': [{'label': 'Books published', 'data': values}],
            'summary': [
                {'label': 'Books in selection', 'value': f'{len(frame):,}'},
                {'label': 'Peak year', 'value': str(peak_year)},
                {'label': 'Peak publications', 'value': f'{peak_count:,}'},
                {'label': 'Average per year', 'value': f'{avg:,.1f}'},
            ],
            'table': [{'Year': label, 'Books': value} for label, value in zip(labels, values)],
            'interpretation': interpretation,
        }
