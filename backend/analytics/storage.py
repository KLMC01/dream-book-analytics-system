from pathlib import Path
import json
import uuid
import pandas as pd

from .exceptions import DatasetError


class DatasetStorage:
    """Single responsibility: persist and retrieve normalized datasets."""

    def __init__(self, base_dir: Path):
        self.base_dir = Path(base_dir)
        self.sample_path = self.base_dir / 'data' / 'sample_books.csv'
        self.upload_dir = self.base_dir / 'uploads'
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    def get_path(self, dataset_id: str) -> Path:
        if dataset_id == 'sample':
            return self.sample_path
        candidate = self.upload_dir / f'{dataset_id}.csv'
        if not candidate.exists():
            raise DatasetError('The selected dataset could not be found. Please upload it again.')
        return candidate

    def load(self, dataset_id: str) -> pd.DataFrame:
        path = self.get_path(dataset_id)
        try:
            return pd.read_csv(path, dtype={'ISBN': 'string', 'BNB id': 'string'})
        except Exception as exc:
            raise DatasetError(f'Unable to read dataset: {exc}') from exc

    def save(self, dataframe: pd.DataFrame, original_filename: str = 'uploaded-dataset.csv') -> str:
        dataset_id = uuid.uuid4().hex
        dataframe.to_csv(self.upload_dir / f'{dataset_id}.csv', index=False)
        (self.upload_dir / f'{dataset_id}.json').write_text(
            json.dumps({'filename': original_filename}, ensure_ascii=False), encoding='utf-8'
        )
        return dataset_id

    def filename_for(self, dataset_id: str) -> str:
        if dataset_id == 'sample':
            return 'Dataset Books.csv'
        meta_path = self.upload_dir / f'{dataset_id}.json'
        if meta_path.exists():
            try:
                return json.loads(meta_path.read_text(encoding='utf-8')).get('filename') or f'{dataset_id}.csv'
            except Exception:
                pass
        return f'{dataset_id}.csv'
