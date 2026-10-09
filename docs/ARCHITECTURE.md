# Architecture notes

## Separation of responsibilities

The project deliberately separates dataset loading, persistence, analysis, API transport and report generation. This gives you concrete implementation evidence for discussing clean code and SOLID principles in the assignment report.

- `DatasetLoader` has one reason to change: supported input formats/schema normalization.
- `DatasetStorage` has one reason to change: how normalized datasets are stored/retrieved.
- Each analysis class owns one analysis algorithm.
- `AnalysisFactory` maps a route key to the appropriate analysis strategy.
- Django API views translate HTTP requests into service calls rather than containing analysis logic.
- React components consume API results and handle presentation only.

## Pattern examples

- **Strategy:** each class derived from `BaseAnalysis` provides a different analysis algorithm through the same `execute()` workflow.
- **Factory:** `AnalysisFactory` selects the correct strategy from the analysis key.
- **Provider/Context on the frontend:** React contexts centralize active dataset and theme state for reusable components.

These are implementation notes, not a replacement for your assignment's written design justification.
