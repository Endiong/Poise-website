import type React from "react"

interface DataPoint {
  date: string
  score: number
}

interface LineChartProps {
  data: DataPoint[]
  theme: "light" | "dark"
  title?: string
  height?: number
}

export const LineChart: React.FC<LineChartProps> = ({ data, theme, title, height = 300 }) => {
  if (!data || data.length === 0) {
    return null
  }

  const padding = 40
  const width = 600
  const chartHeight = height - padding * 2
  const chartWidth = width - padding * 2

  // Find min and max scores
  const scores = data.map((d) => d.score)
  const minScore = Math.min(...scores, 0)
  const maxScore = Math.max(...scores, 100)
  const range = maxScore - minScore || 100

  // Calculate points
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth
    const y = padding + chartHeight - ((d.score - minScore) / range) * chartHeight
    return { x, y, ...d }
  })

  // Line path
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")

  // Colors based on theme
  const lineColor = theme === "dark" ? "#3b82f6" : "#2563eb"
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"
  const textColor = theme === "dark" ? "#9ca3af" : "#6b7280"
  const bgColor = theme === "dark" ? "transparent" : "transparent"

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>}
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Grid lines */}
        {Array.from({ length: 5 }).map((_, i) => {
          const y = padding + (chartHeight / 4) * i
          return (
            <line
              key={`grid-${i}`}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke={gridColor}
              strokeWidth="1"
              strokeDasharray="4"
            />
          )
        })}

        {/* Y-axis labels */}
        {Array.from({ length: 5 }).map((_, i) => {
          const value = Math.round(minScore + (range / 4) * i)
          const y = padding + chartHeight - (chartHeight / 4) * i
          return (
            <text
              key={`y-label-${i}`}
              x={padding - 10}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize="12"
              fill={textColor}
            >
              {value}%
            </text>
          )
        })}

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={lineColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {points.map((p, i) => (
          <circle
            key={`point-${i}`}
            cx={p.x}
            cy={p.y}
            r="4"
            fill={lineColor}
            stroke={theme === "dark" ? "#1f2937" : "#ffffff"}
            strokeWidth="2"
          />
        ))}

        {/* X-axis labels */}
        {points.map((p, i) => {
          if (data.length > 7 && i % Math.ceil(data.length / 7) !== 0) return null
          return (
            <text key={`x-label-${i}`} x={p.x} y={height - 10} textAnchor="middle" fontSize="12" fill={textColor}>
              {p.date}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

export default LineChart
