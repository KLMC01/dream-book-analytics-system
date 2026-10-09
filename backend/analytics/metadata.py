import pandas as pd


class MetadataService:
    def build(self, frame: pd.DataFrame, *, dataset_id: str, filename: str, is_sample: bool) -> dict:
        years = pd.to_numeric(frame['publication date'], errors='coerce').dropna().astype(int)
        languages = sorted(frame['language'].dropna().astype(str).loc[lambda s: s.str.len() > 0].unique().tolist())
        publishers = sorted(frame['book publisher'].dropna().astype(str).loc[lambda s: s.str.len() > 0].unique().tolist())
        authors = frame['author'].dropna().astype(str).loc[lambda s: s.str.len() > 0]
        return {
            'dataset_id': dataset_id,
            'filename': filename,
            'is_sample': is_sample,
            'total_books': int(len(frame)),
            'unique_authors': int(authors.nunique()),
            'publishers_count': int(frame['book publisher'].nunique(dropna=True)),
            'languages_count': int(frame['language'].nunique(dropna=True)),
            'min_year': int(years.min()) if not years.empty else None,
            'max_year': int(years.max()) if not years.empty else None,
            'languages': languages,
            'publishers': publishers,
        }
