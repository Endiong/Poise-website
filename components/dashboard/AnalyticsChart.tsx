import type React from "react"

interface ChartData {
  date: string
  score: number
}

interface AnalyticsChartProps {
  theme: "light" | "dark"
  data: ChartData[]
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ theme, data }) => {
  const maxScore = 100
  const minScore = 70
  const range = maxScore - minScore

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Weekly Posture Score</h3>
      <div className="h-64 flex items-end gap-2 justify-around px-4">
        {data.map((item, idx) => {
          const heightPercent = ((item.score - minScore) / range) * 100
          return (
            <div key={idx} className="flex flex-col items-center gap-2 flex-1">
              <div
                className="w-full bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden"
                style={{ height: "200px" }}
              >
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.date}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.score}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AnalyticsChart
