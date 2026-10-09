from .base import BaseAnalysis


class MissingISBNAnalysis(BaseAnalysis):
    key = 'missing-isbn'
    title = 'Missing ISBN Analysis'
    default_chart = 'doughnut'
    allowed_charts = ('doughnut', 'pie', 'bar')

    def analyse(self, frame, filters):
        values = frame['ISBN'].astype('string')
        missing_mask = values.isna() | values.fillna('').str.strip().str.lower().isin({'', 'nan', 'none', 'n/a', 'na', '<na>'})
        missing = int(missing_mask.sum())
        present = int(len(frame) - missing)
        percentage = round((missing / len(frame) * 100), 2) if len(frame) else 0
        interpretation = (
            f'{missing:,} of {len(frame):,} records are missing an ISBN, giving a missing-data rate of {percentage:.2f}%. '
            f'{present:,} records contain an ISBN.'
            if len(frame) else 'No records match the selected filters.'
        )
        return {
            'labels': ['ISBN present', 'ISBN missing'],
            'datasets': [{'label': 'Records', 'data': [present, missing]}],
            'summary': [
                {'label': 'Records analysed', 'value': f'{len(frame):,}'},
                {'label': 'ISBN present', 'value': f'{present:,}'},
                {'label': 'ISBN missing', 'value': f'{missing:,}'},
                {'label': 'Missing percentage', 'value': f'{percentage:.2f}%'},
            ],
            'table': [
                {'ISBN status': 'Present', 'Records': present, 'Percentage': f'{100 - percentage:.2f}%'},
                {'ISBN status': 'Missing', 'Records': missing, 'Percentage': f'{percentage:.2f}%'},
            ],
            'interpretation': interpretation,
        }
