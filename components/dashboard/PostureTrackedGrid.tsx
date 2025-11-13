import type React from "react"

interface TrackedDay {
  date: Date
  tracked: boolean
}

interface PostureTrackedGridProps {
  theme: "light" | "dark"
}

export const PostureTrackedGrid: React.FC<PostureTrackedGridProps> = ({ theme }) => {
  // Generate last 119 days (17 weeks x 7 days)
  const days: TrackedDay[] = Array.from({ length: 119 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    // Randomly determine if tracked (70% chance)
    return {
      date,
      tracked: Math.random() > 0.3,
    }
  }).reverse()

  // Group days by weeks
  const weeks: TrackedDay[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const getBackgroundColor = (tracked: boolean) => {
    if (tracked) {
      return theme === "dark" ? "#3b82f6" : "#2563eb"
    }
    return theme === "dark" ? "#f3f4f6" : "#e5e7eb"
  }

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Days Tracked</h3>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {/* Day labels */}
        <div className="flex flex-col gap-2 min-w-fit">
          <div className="h-5" />
          {dayLabels.map((label) => (
            <div
              key={label}
              className="w-6 h-6 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400"
            >
              {label.charAt(0)}
            </div>
          ))}
        </div>

        {/* Weeks grid */}
        <div className="flex gap-2">
          {weeks.map((week, weekIdx) => (
            <div key={`week-${weekIdx}`} className="flex flex-col gap-2">
              {week.map((day, dayIdx) => (
                <div
                  key={`day-${weekIdx}-${dayIdx}`}
                  className="w-6 h-6 rounded-sm cursor-pointer hover:opacity-80 transition-opacity border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: getBackgroundColor(day.tracked) }}
                  title={`${day.date.toDateString()}: ${day.tracked ? "Tracked" : "Not tracked"}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={`legend-${i}`}
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor:
                  theme === "dark"
                    ? ["#374151", "#1e40af", "#1d4ed8", "#3b82f6"][i - 1]
                    : ["#f3f4f6", "#dbeafe", "#93c5fd", "#2563eb"][i - 1],
              }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  )
}

export default PostureTrackedGrid
