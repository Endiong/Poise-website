export interface User {
  id: string
  email: string
  name: string
  profilePicture?: string
  createdAt: number
}

export interface AuthState {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
}

const USERS_STORAGE_KEY = "poise-users"
const AUTH_SESSION_KEY = "poise-auth-session"

// Get all registered users
export function getAllUsers(): User[] {
  if (typeof window === "undefined") return []
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY)
  return usersJson ? JSON.parse(usersJson) : []
}

// Save a new user
export function registerUser(email: string, name: string, password: string, profilePicture?: string): User {
  const existingUsers = getAllUsers()
  if (existingUsers.some((u) => u.email === email)) {
    throw new Error("Email already registered")
  }

  const newUser: User = {
    id: Math.random().toString(36).substring(7),
    email,
    name,
    profilePicture: profilePicture || generateProfileInitial(name),
    createdAt: Date.now(),
  }

  // Store password hash (in production, this should be hashed server-side)
  const userWithPassword = { ...newUser, password: btoa(password) }
  existingUsers.push(userWithPassword)
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers))

  return newUser
}

// Verify login credentials
export function loginWithEmail(email: string, password: string): User | null {
  const users = getAllUsers()
  const user = users.find((u: any) => u.email === email)

  if (!user) {
    return null
  }

  // Verify password (basic comparison - in production use proper hashing)
  const storedUser = user as any
  if (storedUser.password !== btoa(password)) {
    return null
  }

  const { password: _, ...userWithoutPassword } = storedUser
  return userWithoutPassword as User
}

// Simulate Google Auth
export function loginWithGoogle(googleUser: { name: string; email: string; profilePicture?: string }): User {
  const existingUsers = getAllUsers()
  const user = existingUsers.find((u: any) => u.email === googleUser.email)

  if (!user) {
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      email: googleUser.email,
      name: googleUser.name,
      profilePicture: googleUser.profilePicture || generateProfileInitial(googleUser.name),
      createdAt: Date.now(),
    }
    existingUsers.push(newUser)
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers))
    return newUser
  }

  return user as User
}

// Create session
export function createSession(user: User): void {
  if (typeof window === "undefined") return
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user))
}

// Get current session
export function getCurrentSession(): User | null {
  if (typeof window === "undefined") return null
  const sessionJson = localStorage.getItem(AUTH_SESSION_KEY)
  return sessionJson ? JSON.parse(sessionJson) : null
}

// Clear session (logout)
export function clearSession(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_SESSION_KEY)
}

// Generate profile initial
function generateProfileInitial(name: string): string {
  const initial = name.charAt(0).toUpperCase()
  const colors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"]
  const color = colors[name.charCodeAt(0) % colors.length]
  return `${color}|${initial}`
}

// Change password
export function changePassword(email: string, currentPassword: string, newPassword: string): boolean {
  const users = getAllUsers()
  const userIndex = users.findIndex((u: any) => u.email === email && u.password === btoa(currentPassword))

  if (userIndex === -1) {
    return false
  }
  ;(users[userIndex] as any).password = btoa(newPassword)
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  return true
}
