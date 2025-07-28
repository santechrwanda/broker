"use client"

import { useState } from "react"
import {
  FiUser,
  FiShield,
  FiClock,
  FiSmartphone,
  FiKey,
  FiSettings,
  FiBarChart2,
  FiFileText,
} from "react-icons/fi"

interface AdminProfile {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    title: string
    department: string
    employeeId: string
    avatar: string
  }
  security: {
    twoFactorEnabled: boolean
    lastPasswordChange: string
    loginAttempts: number
    sessionTimeout: number
    trustedDevices: number
  }
  preferences: {
    language: string
    timezone: string
    dateFormat: string
    currency: string
    theme: string
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
      desktop: boolean
    }
  }
  activity: {
    lastLogin: string
    totalLogins: number
    averageSessionTime: string
    actionsPerformed: number
  }
}

export default function AdminProfile() {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "preferences" | "activity">("profile")
  const [isEditing, setIsEditing] = useState(false)

  const [profile, setProfile] = useState<AdminProfile>({
    personalInfo: {
      firstName: "John",
      lastName: "Anderson",
      email: "john.anderson@brokerplatform.com",
      phone: "+1 (555) 123-4567",
      title: "System Administrator",
      department: "IT Operations",
      employeeId: "EMP-2024-001",
      avatar: "",
    },
    security: {
      twoFactorEnabled: true,
      lastPasswordChange: "2024-01-01",
      loginAttempts: 0,
      sessionTimeout: 30,
      trustedDevices: 3,
    },
    preferences: {
      language: "en",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      currency: "USD",
      theme: "light",
      notifications: {
        email: true,
        sms: true,
        push: false,
        desktop: true,
      },
    },
    activity: {
      lastLogin: "2024-01-15 14:30:25",
      totalLogins: 1247,
      averageSessionTime: "2h 15m",
      actionsPerformed: 5632,
    },
  })

  const updateProfile = (section: keyof AdminProfile, field: string, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const updateNestedProfile = (section: keyof AdminProfile, subsection: string, field: string, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [field]: value,
        },
      },
    }))
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {profile.personalInfo.firstName[0]}
                {profile.personalInfo.lastName[0]}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {profile.personalInfo.firstName} {profile.personalInfo.lastName}
            </h2>
            <p className="text-gray-600">{profile.personalInfo.title}</p>
            <p className="text-sm text-gray-500">{profile.personalInfo.department}</p>
            <div className="flex items-center mt-2 space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>
                Active
              </span>
              <span className="text-sm text-gray-500">Employee ID: {profile.personalInfo.employeeId}</span>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={profile.personalInfo.firstName}
              onChange={(e) => updateProfile("personalInfo", "firstName", e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={profile.personalInfo.lastName}
              onChange={(e) => updateProfile("personalInfo", "lastName", e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={profile.personalInfo.email}
              onChange={(e) => updateProfile("personalInfo", "email", e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={profile.personalInfo.phone}
              onChange={(e) => updateProfile("personalInfo", "phone", e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
            <input
              type="text"
              value={profile.personalInfo.title}
              onChange={(e) => updateProfile("personalInfo", "title", e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={profile.personalInfo.department}
              onChange={(e) => updateProfile("personalInfo", "department", e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            >
              <option value="IT Operations">IT Operations</option>
              <option value="Trading">Trading</option>
              <option value="Compliance">Compliance</option>
              <option value="Risk Management">Risk Management</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiClock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Last Login</p>
              <p className="text-lg font-semibold text-gray-900">Jan 15, 2:30 PM</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiShield className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Security Score</p>
              <p className="text-lg font-semibold text-gray-900">98/100</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiBarChart2 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Actions Today</p>
              <p className="text-lg font-semibold text-gray-900">47</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FiSmartphone className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Trusted Devices</p>
              <p className="text-lg font-semibold text-gray-900">{profile.security.trustedDevices}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Security Overview</h3>
          <div className="flex items-center space-x-2">
            <FiShield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">Excellent Security</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">98</div>
            <div className="text-sm text-gray-600">Security Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{profile.security.trustedDevices}</div>
            <div className="text-sm text-gray-600">Trusted Devices</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Security Alerts</div>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-medium text-gray-900">2FA Status</p>
            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Enabled
            </span>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              Configure
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <FiSmartphone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Authenticator App</p>
                <p className="text-sm text-gray-600">Google Authenticator</p>
              </div>
            </div>
            <span className="text-green-600 text-sm font-medium">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Email Backup</p>
                <p className="text-sm text-gray-600">j***@brokerplatform.com</p>
              </div>
            </div>
            <span className="text-gray-400 text-sm font-medium">Backup</span>
          </div>
        </div>
      </div>

      {/* Password Security */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Password Strength</p>
              <p className="text-sm text-gray-600">Last changed: {profile.security.lastPasswordChange}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>
              <span className="text-sm font-medium text-green-600">Strong</span>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Change Password
          </button>
        </div>
      </div>

      {/* Session Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              value={profile.security.sessionTimeout}
              onChange={(e) => updateProfile("security", "sessionTimeout", Number.parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Failed Login Attempts</label>
            <input
              type="number"
              value={profile.security.loginAttempts}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Recent Security Events */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Events</h3>
        <div className="space-y-3">
          {[
            { time: "2 hours ago", event: "Successful login from Chrome on Windows", status: "success" },
            { time: "1 day ago", event: "Password changed successfully", status: "success" },
            { time: "3 days ago", event: "New device added to trusted devices", status: "info" },
            { time: "1 week ago", event: "2FA backup codes regenerated", status: "info" },
          ].map((event, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full ${event.status === "success" ? "bg-green-500" : "bg-blue-500"}`}
                ></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.event}</p>
                  <p className="text-xs text-gray-500">{event.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      {/* General Preferences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">General Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={profile.preferences.language}
              onChange={(e) => updateProfile("preferences", "language", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={profile.preferences.timezone}
              onChange={(e) => updateProfile("preferences", "timezone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select
              value={profile.preferences.dateFormat}
              onChange={(e) => updateProfile("preferences", "dateFormat", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency Display</label>
            <select
              value={profile.preferences.currency}
              onChange={(e) => updateProfile("preferences", "currency", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </div>
        </div>
      </div>

      {/* Theme Preferences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "light", name: "Light", preview: "bg-white border-2" },
              { value: "dark", name: "Dark", preview: "bg-gray-900 border-2" },
              { value: "auto", name: "Auto", preview: "bg-gradient-to-r from-white to-gray-900 border-2" },
            ].map((theme) => (
              <button
                key={theme.value}
                onClick={() => updateProfile("preferences", "theme", theme.value)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  profile.preferences.theme === theme.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`w-full h-16 rounded ${theme.preview} mb-2`}></div>
                <p className="text-sm font-medium text-gray-900">{theme.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { key: "email", label: "Email Notifications", description: "Receive notifications via email" },
            { key: "sms", label: "SMS Notifications", description: "Receive notifications via SMS" },
            { key: "push", label: "Push Notifications", description: "Receive browser push notifications" },
            { key: "desktop", label: "Desktop Notifications", description: "Show desktop notifications" },
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{notification.label}</p>
                <p className="text-sm text-gray-600">{notification.description}</p>
              </div>
              <button
                onClick={() =>
                  updateNestedProfile(
                    "preferences",
                    "notifications",
                    notification.key,
                    !profile.preferences.notifications[
                      notification.key as keyof typeof profile.preferences.notifications
                    ],
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  profile.preferences.notifications[notification.key as keyof typeof profile.preferences.notifications]
                    ? "bg-blue-600"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    profile.preferences.notifications[
                      notification.key as keyof typeof profile.preferences.notifications
                    ]
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderActivityTab = () => (
    <div className="space-y-6">
      {/* Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiClock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Logins</p>
              <p className="text-2xl font-bold text-gray-900">{profile.activity.totalLogins.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiBarChart2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Actions Performed</p>
              <p className="text-2xl font-bold text-gray-900">{profile.activity.actionsPerformed.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiClock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Session Time</p>
              <p className="text-2xl font-bold text-gray-900">{profile.activity.averageSessionTime}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FiFileText className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Last Login</p>
              <p className="text-lg font-bold text-gray-900">Jan 15, 2:30 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            {
              time: "2 minutes ago",
              action: "Updated trading commission rates",
              details: "Modified stock trading commission from 0.005% to 0.004%",
              type: "settings",
            },
            {
              time: "15 minutes ago",
              action: "Approved company registration",
              details: "Approved TechCorp Inc. for trading platform access",
              type: "approval",
            },
            {
              time: "1 hour ago",
              action: "Generated compliance report",
              details: "Monthly compliance report for January 2024",
              type: "report",
            },
            {
              time: "2 hours ago",
              action: "Modified user permissions",
              details: "Updated permissions for teller role",
              type: "security",
            },
            {
              time: "3 hours ago",
              action: "System backup initiated",
              details: "Manual backup of trading data and user information",
              type: "system",
            },
          ].map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
              <div
                className={`p-2 rounded-lg ${
                  activity.type === "settings"
                    ? "bg-blue-100"
                    : activity.type === "approval"
                      ? "bg-green-100"
                      : activity.type === "report"
                        ? "bg-purple-100"
                        : activity.type === "security"
                          ? "bg-red-100"
                          : "bg-gray-100"
                }`}
              >
                {activity.type === "settings" && <FiSettings className="w-5 h-5 text-blue-600" />}
                {activity.type === "approval" && <FiShield className="w-5 h-5 text-green-600" />}
                {activity.type === "report" && <FiFileText className="w-5 h-5 text-purple-600" />}
                {activity.type === "security" && <FiKey className="w-5 h-5 text-red-600" />}
                {activity.type === "system" && <FiSettings className="w-5 h-5 text-gray-600" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium">View All Activity</button>
        </div>
      </div>

      {/* Login History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Login History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4 font-medium text-gray-700">Date & Time</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Device</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Location</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">IP Address</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  date: "Jan 15, 2024 2:30 PM",
                  device: "Chrome on Windows",
                  location: "New York, NY",
                  ip: "192.168.1.100",
                  status: "Success",
                },
                {
                  date: "Jan 15, 2024 9:15 AM",
                  device: "Safari on macOS",
                  location: "New York, NY",
                  ip: "192.168.1.101",
                  status: "Success",
                },
                {
                  date: "Jan 14, 2024 4:45 PM",
                  device: "Chrome on Windows",
                  location: "New York, NY",
                  ip: "192.168.1.100",
                  status: "Success",
                },
                {
                  date: "Jan 14, 2024 8:30 AM",
                  device: "Mobile App",
                  location: "New York, NY",
                  ip: "192.168.1.102",
                  status: "Success",
                },
              ].map((login, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm">{login.date}</td>
                  <td className="py-3 px-4 text-sm">{login.device}</td>
                  <td className="py-3 px-4 text-sm">{login.location}</td>
                  <td className="py-3 px-4 text-sm font-mono">{login.ip}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {login.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: "profile", name: "Profile", icon: FiUser },
    { id: "security", name: "Security", icon: FiShield },
    { id: "preferences", name: "Preferences", icon: FiSettings },
    { id: "activity", name: "Activity", icon: FiClock },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab()
      case "security":
        return renderSecurityTab()
      case "preferences":
        return renderPreferencesTab()
      case "activity":
        return renderActivityTab()
      default:
        return renderProfileTab()
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto bg-gray-50 sm:px-6 lg:px-8 py-8 mt-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal information, security settings, and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>

            {/* Quick Actions */}
            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                  Change Password
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                  Download Data
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                  View Audit Log
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                  Sign Out All Devices
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  )
}
