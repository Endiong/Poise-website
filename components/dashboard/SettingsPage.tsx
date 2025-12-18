"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { Alert, AlertDescription } from "../ui/alert"
import { Loader2, Check, AlertCircle } from "lucide-react"
import { updateUserPassword, updateUserProfile } from "../../utils/auth"

interface User {
  id: string
  email: string
  name: string
  profilePicture?: string
  createdAt: number
}

interface SettingsPageProps {
  user: User
  onProfileUpdate?: (user: User) => void
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, onProfileUpdate }) => {
  const [name, setName] = useState(user.name)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [error, setError] = useState("")

  // Notification preferences
  const [postureReminders, setPostureReminders] = useState(true)
  const [dailyReports, setDailyReports] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setProfileSuccess(false)
    setLoading(true)

    try {
      const result = await updateUserProfile(user.id, { name })
      if (result.success && result.user) {
        setProfileSuccess(true)
        onProfileUpdate?.(result.user)
        setTimeout(() => setProfileSuccess(false), 3000)
      } else {
        setError(result.error || "Failed to update profile")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setPasswordSuccess(false)

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const result = await updateUserPassword(user.email, currentPassword, newPassword)
      if (result.success) {
        setPasswordSuccess(true)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setTimeout(() => setPasswordSuccess(false), 3000)
      } else {
        setError(result.error || "Failed to update password")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email} disabled className="bg-gray-100 dark:bg-gray-800" />
              <p className="text-sm text-gray-500">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label>Member Since</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            {profileSuccess && (
              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600 dark:text-green-400">
                  Profile updated successfully!
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={loading || name === user.name}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {passwordSuccess && (
              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600 dark:text-green-400">
                  Password updated successfully!
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how you receive updates and reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Posture Reminders</p>
              <p className="text-sm text-gray-500">Get notified when your posture needs adjustment</p>
            </div>
            <Switch checked={postureReminders} onCheckedChange={setPostureReminders} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Daily Reports</p>
              <p className="text-sm text-gray-500">Receive daily summary of your posture tracking</p>
            </div>
            <Switch checked={dailyReports} onCheckedChange={setDailyReports} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Digest</p>
              <p className="text-sm text-gray-500">Get a weekly overview of your progress</p>
            </div>
            <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
            </div>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsPage
