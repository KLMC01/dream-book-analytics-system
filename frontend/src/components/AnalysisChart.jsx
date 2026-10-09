import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2'
import { useTheme } from '../context/ThemeContext'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler)

const palette = ['#4f8cff', '#28c58b', '#9b7cff', '#ffad45', '#ec5f9d', '#20b7a6', '#f86d70', '#7aa2f7', '#8fbc8f', '#c084fc']

export default function AnalysisChart({ result, chartType }) {
  const { theme } = useTheme()
  if (!result?.labels?.length) return <div className="empty-state">No chart data is available for the selected filters.</div>
  const multi = result.datasets.length > 1
  const data = {
    labels: result.labels,
    datasets: result.datasets.map((dataset, index) => ({
      ...dataset,
      borderColor: multi ? palette[index % palette.length] : '#4f8cff',
      backgroundColor: chartType === 'line' ? `${palette[index % palette.length]}33` : multi ? palette[index % palette.length] : result.labels.map((_, i) => palette[i % palette.length]),
      borderWidth: 2,
      tension: .3,
      fill: chartType === 'line' && result.datasets.length === 1,
      pointRadius: chartType === 'line' ? 3 : 0,
    })),
  }

  const axisText = theme === 'dark' ? '#aebed1' : '#536174'
  const gridColor = theme === 'dark' ? 'rgba(170,190,215,.11)' : 'rgba(120,130,150,.12)'

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 650 },
    plugins: {
      legend: { display: multi || ['pie', 'doughnut'].includes(chartType), position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, color: axisText } },
      tooltip: { intersect: false, mode: chartType === 'line' ? 'index' : 'nearest' },
    },
    scales: ['pie', 'doughnut'].includes(chartType) ? undefined : {
      x: { grid: { display: false }, ticks: { maxRotation: 45, minRotation: 0, color: axisText } },
      y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: axisText } },
    },
    indexAxis: chartType === 'horizontalBar' ? 'y' : 'x',
  }

  if (chartType === 'line') return <Line data={data} options={options} />
  if (chartType === 'pie') return <Pie data={data} options={options} />
  if (chartType === 'doughnut') return <Doughnut data={data} options={{ ...options, cutout: '62%' }} />
  return <Bar data={data} options={options} />
}
