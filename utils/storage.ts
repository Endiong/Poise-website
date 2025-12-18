export const saveToLocalStorage = (key: string, state: any) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(key, serializedState)
  } catch (error) {
    console.error("Could not save state", error)
  }
}

export const loadFromLocalStorage = (key: string) => {
  try {
    const serializedState = localStorage.getItem(key)
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (error) {
    console.error("Could not load state", error)
    return undefined
  }
}

export interface PostureSession {
  id: string
  userId?: string
  date: string
  duration: number
  averageScore: number
  alerts: number
  goodPostureTime: number
  poorPostureTime: number
}

export const savePostureSession = (session: PostureSession) => {
  const sessions = loadFromLocalStorage("postureSessions") || []
  sessions.push(session)
  saveToLocalStorage("postureSessions", sessions)
}

export const getPostureSessions = (userId?: string): PostureSession[] => {
  const sessions = loadFromLocalStorage("postureSessions") || []
  if (userId) {
    return sessions.filter((s: PostureSession) => s.userId === userId)
  }
  return sessions
}

export const getPostureStats = (userId?: string) => {
  const sessions = getPostureSessions(userId)
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      totalDuration: 0,
      averageScore: 0,
      totalAlerts: 0,
      goodPosturePercentage: 0,
      last30DaysScore: 0,
      totalGoodDuration: 0,
      recentSessions: [],
    }
  }

  const totalDuration = sessions.reduce((sum: number, s: PostureSession) => sum + s.duration, 0)
  const averageScore = sessions.reduce((sum: number, s: PostureSession) => sum + s.averageScore, 0) / sessions.length
  const totalAlerts = sessions.reduce((sum: number, s: PostureSession) => sum + s.alerts, 0)
  const totalGoodTime = sessions.reduce((sum: number, s: PostureSession) => sum + s.goodPostureTime, 0)
  const goodPosturePercentage = totalDuration > 0 ? (totalGoodTime / totalDuration) * 100 : 0

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const last30DaysSessions = sessions.filter((s: PostureSession) => new Date(s.date) >= thirtyDaysAgo)
  const last30DaysScore =
    last30DaysSessions.length > 0
      ? Math.round(
          last30DaysSessions.reduce((sum: number, s: PostureSession) => sum + s.averageScore, 0) /
            last30DaysSessions.length,
        )
      : 0

  const recentSessions = sessions
    .slice(-10)
    .reverse()
    .map((s: PostureSession) => ({
      id: s.id,
      createdAt: s.date,
      duration: s.duration,
      score: s.averageScore,
    }))

  return {
    totalSessions: sessions.length,
    totalDuration,
    averageScore: Math.round(averageScore),
    totalAlerts,
    goodPosturePercentage: Math.round(goodPosturePercentage),
    last30DaysScore,
    totalGoodDuration: totalGoodTime,
    recentSessions,
  }
}

export const getPostureHistory = (days = 7, userId?: string) => {
  const sessions = getPostureSessions(userId)
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  return sessions
    .filter((s: PostureSession) => new Date(s.date) >= cutoffDate)
    .map((s: PostureSession) => ({
      id: s.id,
      date: s.date,
      score: s.averageScore,
      duration: s.duration,
    }))
}
