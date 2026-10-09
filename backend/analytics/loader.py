from pathlib import Path
import io
import re
import pandas as pd

from .exceptions import DatasetError


class DatasetLoader:
    """Reads supported tabular formats and normalizes them to the application's schema."""

    REQUIRED = ['author', 'publication date', 'language', 'book publisher', 'ISBN']
    CANONICAL = ['book', 'author', 'publication date', 'language', 'book publisher', 'ISBN', 'BNB id']
    ALIASES = {
        'book': {'book', 'title', 'book title', 'name'},
        'author': {'author', 'authors', 'author name', 'writer'},
        'publication date': {'publication date', 'publication year', 'published year', 'year', 'date published'},
        'language': {'language', 'language of publication', 'book language'},
        'book publisher': {'book publisher', 'publisher', 'publishing house', 'publisher name'},
        'ISBN': {'isbn', 'isbn 13', 'isbn13', 'isbn-13', 'book isbn'},
        'BNB id': {'bnb id', 'bnb_id', 'bnbid', 'record id', 'id'},
    }

    def load_upload(self, uploaded_file) -> pd.DataFrame:
        suffix = Path(uploaded_file.name).suffix.lower()
        if suffix not in {'.csv', '.tsv', '.xlsx', '.xls', '.json'}:
            raise DatasetError('Unsupported file type. Please use CSV, TSV, XLSX, XLS, or JSON.')
        try:
            raw = uploaded_file.read()
            if suffix == '.csv':
                frame = pd.read_csv(io.BytesIO(raw))
            elif suffix == '.tsv':
                frame = pd.read_csv(io.BytesIO(raw), sep='\t')
            elif suffix in {'.xlsx', '.xls'}:
                frame = pd.read_excel(io.BytesIO(raw))
            else:
                frame = pd.read_json(io.BytesIO(raw))
        except Exception as exc:
            raise DatasetError(f'The file could not be read: {exc}') from exc
        return self.normalize(frame)

    def normalize(self, frame: pd.DataFrame) -> pd.DataFrame:
        if frame.empty:
            raise DatasetError('The dataset is empty.')

        rename = {}
        normalized_to_original = {self._clean_name(col): col for col in frame.columns}
        for canonical, aliases in self.ALIASES.items():
            for alias in aliases:
                original = normalized_to_original.get(self._clean_name(alias))
                if original is not None:
                    rename[original] = canonical
                    break

        frame = frame.rename(columns=rename).copy()
        missing = [column for column in self.REQUIRED if column not in frame.columns]
        if missing:
            raise DatasetError(
                'Missing required columns: ' + ', '.join(missing) + '. '
                'Expected fields include author, publication date/year, language, publisher and ISBN.'
            )

        if 'book' not in frame.columns:
            frame['book'] = [f'Book {i + 1}' for i in range(len(frame))]
        if 'BNB id' not in frame.columns:
            frame['BNB id'] = [f'ROW-{i + 1:06d}' for i in range(len(frame))]

        frame = frame[self.CANONICAL]
        frame['publication date'] = self._extract_year(frame['publication date'])
        for column in ['book', 'author', 'language', 'book publisher']:
            frame[column] = frame[column].astype('string').str.strip()
        frame['ISBN'] = frame['ISBN'].astype('string').str.strip()
        frame['BNB id'] = frame['BNB id'].astype('string').str.strip()
        return frame

    @staticmethod
    def _clean_name(value: str) -> str:
        return re.sub(r'[^a-z0-9]+', ' ', str(value).lower()).strip()

    @staticmethod
    def _extract_year(series: pd.Series) -> pd.Series:
        numeric = pd.to_numeric(series, errors='coerce')
        result = numeric.where(numeric.between(1000, 3000))
        unresolved = result.isna()
        if unresolved.any():
            parsed = pd.to_datetime(series[unresolved], errors='coerce')
            result.loc[unresolved] = parsed.dt.year
        return result.astype('Int64')
