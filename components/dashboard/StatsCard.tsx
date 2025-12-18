import type React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: "up" | "down"
  unit?: string
  icon?: React.ReactNode
  iconBg?: string
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, trend, unit, icon, iconBg }) => {
  const trendColor =
    trend === "up"
      ? "text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-500/20"
      : trend === "down"
        ? "text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-500/20"
        : ""

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-4">
        {icon && iconBg && (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>{icon}</div>
        )}
        <div className="flex-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            {unit && <p className="text-base text-gray-600 dark:text-gray-300 ml-1">{unit}</p>}
          </div>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
          {trend && (
            <div
              className={`inline-flex items-center gap-1 text-xs font-semibold mt-2 px-2 py-0.5 rounded-full ${trendColor}`}
            >
              {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend === "up" ? "Improving" : "Declining"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StatsCard
