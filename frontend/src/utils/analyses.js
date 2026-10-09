import { TrendingUp, Users, Languages, Building2, BadgeHelp, ChartNoAxesCombined } from 'lucide-react'

export const analyses = [
  {
    key: 'publication-trends',
    title: 'Publication Trends',
    longTitle: 'Publication Trends Over Time',
    description: 'Track the number of books published each year and reveal changes over time.',
    icon: TrendingUp,
    accent: 'blue',
  },
  {
    key: 'top-authors',
    title: 'Top Authors',
    longTitle: 'Top Most Prolific Authors',
    description: 'Rank authors by publication count and identify the strongest contributors.',
    icon: Users,
    accent: 'green',
  },
  {
    key: 'language-distribution',
    title: 'Language Distribution',
    longTitle: 'Language Distribution of Books',
    description: 'Understand how the collection is distributed across publication languages.',
    icon: Languages,
    accent: 'pink',
  },
  {
    key: 'publisher-analysis',
    title: 'Publisher Analysis',
    longTitle: 'Books Published by Publisher',
    description: 'Compare publishers and highlight the largest contributors to the dataset.',
    icon: Building2,
    accent: 'orange',
  },
  {
    key: 'missing-isbn',
    title: 'Missing ISBN',
    longTitle: 'Missing ISBN Analysis',
    description: 'Measure ISBN completeness using counts and percentages of missing records.',
    icon: BadgeHelp,
    accent: 'violet',
  },
  {
    key: 'year-language',
    title: 'Year + Language',
    longTitle: 'Books per Year by Language',
    description: 'Compare publication trends over time across different languages.',
    icon: ChartNoAxesCombined,
    accent: 'teal',
  },
]

export const analysisMap = Object.fromEntries(analyses.map(item => [item.key, item]))
