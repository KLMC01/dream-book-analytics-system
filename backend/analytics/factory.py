from .analyses.publication_trends import PublicationTrendsAnalysis
from .analyses.top_authors import TopAuthorsAnalysis
from .analyses.language_distribution import LanguageDistributionAnalysis
from .analyses.publisher_analysis import PublisherAnalysis
from .analyses.missing_isbn import MissingISBNAnalysis
from .analyses.year_language import YearLanguageAnalysis
from .exceptions import AnalysisError


class AnalysisFactory:
    """Factory pattern: selects an analysis strategy by route key."""

    _registry = {
        cls.key: cls
        for cls in (
            PublicationTrendsAnalysis,
            TopAuthorsAnalysis,
            LanguageDistributionAnalysis,
            PublisherAnalysis,
            MissingISBNAnalysis,
            YearLanguageAnalysis,
        )
    }

    def create(self, key: str):
        analysis_class = self._registry.get(key)
        if not analysis_class:
            raise AnalysisError(f'Unknown analysis type: {key}')
        return analysis_class()
