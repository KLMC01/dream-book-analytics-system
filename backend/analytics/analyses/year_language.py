import pandas as pd
from .base import BaseAnalysis


class YearLanguageAnalysis(BaseAnalysis):
    key = 'year-language'
    title = 'Books per Year by Language'
    default_chart = 'line'
    allowed_charts = ('line', 'bar')

    def analyse(self, frame, filters):
        requested = filters.get('languages') or ''
        if isinstance(requested, str):
            requested = [x.strip() for x in requested.split(',') if x.strip()]
        data = frame.copy()
        data['publication date'] = pd.to_numeric(data['publication date'], errors='coerce')
        data = data.dropna(subset=['publication date'])
        data['publication date'] = data['publication date'].astype(int)
        data['language'] = data['language'].fillna('Unknown').astype(str).replace('', 'Unknown')

        if requested:
            lowered = {x.casefold() for x in requested}
            data = data[data['language'].str.casefold().isin(lowered)]
            languages = sorted(data['language'].unique().tolist())
        else:
            languages = data['language'].value_counts().head(5).index.tolist()
            data = data[data['language'].isin(languages)]

        pivot = data.groupby(['publication date', 'language']).size().unstack(fill_value=0).sort_index()
        labels = [str(y) for y in pivot.index.tolist()]
        datasets = []
        for language in languages:
            if language not in pivot.columns:
                continue
            datasets.append({'label': language, 'data': [int(v) for v in pivot[language].tolist()]})

        totals = {d['label']: sum(d['data']) for d in datasets}
        dominant = max(totals, key=totals.get) if totals else '—'
        dominant_total = totals.get(dominant, 0)
        interpretation = (
            f'{dominant} has the largest total across the displayed language series with {dominant_total:,} books. '
            f'The chart compares {len(datasets)} language series over {len(labels)} publication years.'
            if datasets else 'No year-and-language records match the selected filters.'
        )

        table = []
        for idx, year in enumerate(labels):
            row = {'Year': year}
            for dataset in datasets:
                row[dataset['label']] = dataset['data'][idx]
            table.append(row)

        return {
            'labels': labels,
            'datasets': datasets,
            'summary': [
                {'label': 'Languages shown', 'value': str(len(datasets))},
                {'label': 'Years shown', 'value': str(len(labels))},
                {'label': 'Leading language', 'value': dominant},
                {'label': 'Leading-language books', 'value': f'{dominant_total:,}'},
            ],
            'table': table,
            'interpretation': interpretation,
        }
