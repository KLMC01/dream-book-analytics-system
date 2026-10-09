from abc import ABC, abstractmethod
import pandas as pd


class BaseAnalysis(ABC):
    key = ''
    title = ''
    default_chart = 'bar'
    allowed_charts = ('bar', 'line')

    def execute(self, frame: pd.DataFrame, filters: dict) -> dict:
        filtered = self.apply_filters(frame, filters)
        payload = self.analyse(filtered, filters)
        payload.update({
            'analysis': self.key,
            'title': self.title,
            'default_chart': self.default_chart,
            'allowed_charts': list(self.allowed_charts),
            'filtered_rows': int(len(filtered)),
        })
        return payload

    def apply_filters(self, frame: pd.DataFrame, filters: dict) -> pd.DataFrame:
        data = frame.copy()
        years = pd.to_numeric(data['publication date'], errors='coerce')
        from_year = self._int(filters.get('from_year'))
        to_year = self._int(filters.get('to_year'))
        if from_year is not None:
            data = data[years >= from_year]
            years = pd.to_numeric(data['publication date'], errors='coerce')
        if to_year is not None:
            data = data[years <= to_year]

        language = str(filters.get('language') or '').strip()
        if language and language.lower() != 'all':
            data = data[data['language'].fillna('').astype(str).str.casefold() == language.casefold()]

        publisher = str(filters.get('publisher') or '').strip()
        if publisher and publisher.lower() != 'all':
            data = data[data['book publisher'].fillna('').astype(str).str.casefold() == publisher.casefold()]
        return data

    @staticmethod
    def _int(value):
        try:
            return int(value) if value not in (None, '') else None
        except (TypeError, ValueError):
            return None

    @abstractmethod
    def analyse(self, frame: pd.DataFrame, filters: dict) -> dict:
        raise NotImplementedError
