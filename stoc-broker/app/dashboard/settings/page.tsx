"use client"

import { useState } from "react"
import {
  FiSettings,
  FiBarChart2,
  FiUsers,
  FiCloud,
  FiRefreshCw,
  FiTool,
  FiShield,
  FiBell,
  FiFileText,
  FiEye,
} from "react-icons/fi"
import { MdBalance } from "react-icons/md"

type TabType =
  | "general"
  | "trading"
  | "companies"
  | "users"
  | "sync"
  | "backup"
  | "maintenance"
  | "security"
  | "notifications"
  | "audit"
  | "monitoring"
  | "compliance"

interface TradingHours {
  open: string
  close: string
  timezone: string
}

interface CommissionRate {
  type: "stocks" | "bonds" | "options" | "futures"
  rate: number
  minimum: number
  maximum: number
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<TabType>("general")
  const [settings, setSettings] = useState({
    general: {
      platformName: "BrokerPro",
      logo: "",
      language: "en",
      currency: "USD",
      theme: "light",
    },
    trading: {
      marketHours: {
        open: "09:30",
        close: "16:00",
        timezone: "EST",
      } as TradingHours,
      commissionRates: [
        { type: "stocks" as const, rate: 0.005, minimum: 1, maximum: 50 },
        { type: "bonds" as const, rate: 0.002, minimum: 5, maximum: 100 },
        { type: "options" as const, rate: 0.65, minimum: 0.65, maximum: 65 },
        { type: "futures" as const, rate: 2.25, minimum: 2.25, maximum: 225 },
      ] as CommissionRate[],
      allowAfterHours: false,
      maxOrderSize: 1000000,
      riskLimits: true,
    },
    companies: {
      autoApproval: false,
      requireDocuments: true,
      partnershipThreshold: 100000,
      complianceCheck: true,
    },
    users: {
      roles: {
        admin: { create: true, read: true, update: true, delete: true },
        manager: { create: true, read: true, update: true, delete: false },
        teller: { create: false, read: true, update: true, delete: false },
        accountant: { create: false, read: true, update: false, delete: false },
        client: { create: false, read: true, update: false, delete: false },
      },
      sessionTimeout: 30,
      maxLoginAttempts: 5,
    },
    sync: {
      marketDataProvider: "Bloomberg",
      syncInterval: 5,
      realTimeEnabled: true,
      apiKey: "",
      webhookUrl: "",
    },
    backup: {
      autoBackup: true,
      frequency: "daily",
      retention: 30,
      cloudStorage: true,
    },
    maintenance: {
      enabled: false,
      message: "System under maintenance. Please try again later.",
      allowedIPs: ["192.168.1.1"],
    },
  })

  const tabs = [
    { id: "general", name: "General", icon: FiSettings },
    { id: "trading", name: "Trading Rules", icon: FiBarChart2 },
    { id: "companies", name: "Companies", icon: MdBalance },
    { id: "users", name: "User Permissions", icon: FiUsers },
    { id: "sync", name: "Data Sync", icon: FiCloud },
    { id: "backup", name: "Backup & Export", icon: FiRefreshCw },
    { id: "maintenance", name: "Maintenance", icon: FiTool },
    { id: "security", name: "Security", icon: FiShield },
    { id: "notifications", name: "Notifications", icon: FiBell },
    { id: "audit", name: "Audit Logs", icon: FiFileText },
    { id: "monitoring", name: "Monitoring", icon: FiEye },
    { id: "compliance", name: "Compliance", icon: FiSettings },
  ]

  const updateSettings = (section: string, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
            <input
              type="text"
              value={settings.general.platformName}
              onChange={(e) => updateSettings("general", "platformName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
            <select
              value={settings.general.language}
              onChange={(e) => updateSettings("general", "language", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Base Currency</label>
            <select
              value={settings.general.currency}
              onChange={(e) => updateSettings("general", "currency", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={settings.general.theme}
              onChange={(e) => updateSettings("general", "theme", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Platform Logo</label>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">Logo</span>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Upload Logo
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTradingSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Market Open</label>
            <input
              type="time"
              value={settings.trading.marketHours.open}
              onChange={(e) =>
                updateSettings("trading", "marketHours", { ...settings.trading.marketHours, open: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Market Close</label>
            <input
              type="time"
              value={settings.trading.marketHours.close}
              onChange={(e) =>
                updateSettings("trading", "marketHours", { ...settings.trading.marketHours, close: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={settings.trading.marketHours.timezone}
              onChange={(e) =>
                updateSettings("trading", "marketHours", { ...settings.trading.marketHours, timezone: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="EST">EST</option>
              <option value="PST">PST</option>
              <option value="GMT">GMT</option>
              <option value="CET">CET</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Rates</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4 font-medium text-gray-700">Security Type</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Rate (%)</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Minimum ($)</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Maximum ($)</th>
              </tr>
            </thead>
            <tbody>
              {settings.trading.commissionRates.map((rate, index) => (
                <tr key={rate.type} className="border-b border-gray-100">
                  <td className="py-3 px-4 capitalize">{rate.type}</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      step="0.001"
                      value={rate.rate}
                      onChange={(e) => {
                        const newRates = [...settings.trading.commissionRates]
                        newRates[index].rate = Number.parseFloat(e.target.value)
                        updateSettings("trading", "commissionRates", newRates)
                      }}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      step="0.01"
                      value={rate.minimum}
                      onChange={(e) => {
                        const newRates = [...settings.trading.commissionRates]
                        newRates[index].minimum = Number.parseFloat(e.target.value)
                        updateSettings("trading", "commissionRates", newRates)
                      }}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      step="0.01"
                      value={rate.maximum}
                      onChange={(e) => {
                        const newRates = [...settings.trading.commissionRates]
                        newRates[index].maximum = Number.parseFloat(e.target.value)
                        updateSettings("trading", "commissionRates", newRates)
                      }}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trading Limits & Rules</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Allow After-Hours Trading</label>
              <p className="text-xs text-gray-500">Enable trading outside regular market hours</p>
            </div>
            <button
              onClick={() => updateSettings("trading", "allowAfterHours", !settings.trading.allowAfterHours)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.trading.allowAfterHours ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.trading.allowAfterHours ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Order Size ($)</label>
            <input
              type="number"
              value={settings.trading.maxOrderSize}
              onChange={(e) => updateSettings("trading", "maxOrderSize", Number.parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Enable Risk Limits</label>
              <p className="text-xs text-gray-500">Automatically enforce risk management rules</p>
            </div>
            <button
              onClick={() => updateSettings("trading", "riskLimits", !settings.trading.riskLimits)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.trading.riskLimits ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.trading.riskLimits ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCompanySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Registration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Auto-Approval for New Companies</label>
              <p className="text-xs text-gray-500">Automatically approve company registrations</p>
            </div>
            <button
              onClick={() => updateSettings("companies", "autoApproval", !settings.companies.autoApproval)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.companies.autoApproval ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.companies.autoApproval ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Require Documentation</label>
              <p className="text-xs text-gray-500">Mandate legal documents for company registration</p>
            </div>
            <button
              onClick={() => updateSettings("companies", "requireDocuments", !settings.companies.requireDocuments)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.companies.requireDocuments ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.companies.requireDocuments ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Partnership Threshold ($)</label>
            <input
              type="number"
              value={settings.companies.partnershipThreshold}
              onChange={(e) => updateSettings("companies", "partnershipThreshold", Number.parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum investment required for partnership consideration</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Compliance Check</label>
              <p className="text-xs text-gray-500">Run compliance checks on new companies</p>
            </div>
            <button
              onClick={() => updateSettings("companies", "complianceCheck", !settings.companies.complianceCheck)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.companies.complianceCheck ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.companies.complianceCheck ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderUserPermissions = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4 font-medium text-gray-700">Role</th>
                <th className="text-center py-2 px-4 font-medium text-gray-700">Create</th>
                <th className="text-center py-2 px-4 font-medium text-gray-700">Read</th>
                <th className="text-center py-2 px-4 font-medium text-gray-700">Update</th>
                <th className="text-center py-2 px-4 font-medium text-gray-700">Delete</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(settings.users.roles).map(([role, permissions]) => (
                <tr key={role} className="border-b border-gray-100">
                  <td className="py-3 px-4 capitalize font-medium">{role}</td>
                  {(["create", "read", "update", "delete"] as const).map((action) => (
                    <td key={action} className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={permissions[action]}
                        onChange={(e) => {
                          const newRoles = {
                            ...settings.users.roles,
                            [role]: {
                              ...permissions,
                              [action]: e.target.checked,
                            },
                          }
                          updateSettings("users", "roles", newRoles)
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              value={settings.users.sessionTimeout}
              onChange={(e) => updateSettings("users", "sessionTimeout", Number.parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
            <input
              type="number"
              value={settings.users.maxLoginAttempts}
              onChange={(e) => updateSettings("users", "maxLoginAttempts", Number.parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderDataSync = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Data Provider</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
            <select
              value={settings.sync.marketDataProvider}
              onChange={(e) => updateSettings("sync", "marketDataProvider", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Bloomberg">Bloomberg</option>
              <option value="Reuters">Reuters</option>
              <option value="Yahoo Finance">Yahoo Finance</option>
              <option value="Alpha Vantage">Alpha Vantage</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sync Interval (seconds)</label>
            <input
              type="number"
              value={settings.sync.syncInterval}
              onChange={(e) => updateSettings("sync", "syncInterval", Number.parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <input
              type="password"
              value={settings.sync.apiKey}
              onChange={(e) => updateSettings("sync", "apiKey", e.target.value)}
              placeholder="Enter your API key"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Real-time Data</label>
              <p className="text-xs text-gray-500">Enable real-time market data streaming</p>
            </div>
            <button
              onClick={() => updateSettings("sync", "realTimeEnabled", !settings.sync.realTimeEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.sync.realTimeEnabled ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.sync.realTimeEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhook Configuration</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
          <input
            type="url"
            value={settings.sync.webhookUrl}
            onChange={(e) => updateSettings("sync", "webhookUrl", e.target.value)}
            placeholder="https://your-domain.com/webhook"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">URL to receive real-time market data updates</p>
        </div>
      </div>
    </div>
  )

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Automated Backup</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Enable Auto Backup</label>
              <p className="text-xs text-gray-500">Automatically backup system data</p>
            </div>
            <button
              onClick={() => updateSettings("backup", "autoBackup", !settings.backup.autoBackup)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.backup.autoBackup ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.backup.autoBackup ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
              <select
                value={settings.backup.frequency}
                onChange={(e) => updateSettings("backup", "frequency", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period (days)</label>
              <input
                type="number"
                value={settings.backup.retention}
                onChange={(e) => updateSettings("backup", "retention", Number.parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Cloud Storage</label>
              <p className="text-xs text-gray-500">Store backups in cloud storage</p>
            </div>
            <button
              onClick={() => updateSettings("backup", "cloudStorage", !settings.backup.cloudStorage)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.backup.cloudStorage ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.backup.cloudStorage ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Export</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Export Trading Data
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Export User Data
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
              Export Company Data
            </button>
          </div>
          <div className="text-sm text-gray-600">
            <p>Last backup: January 15, 2024 at 3:00 AM</p>
            <p>Next scheduled backup: January 16, 2024 at 3:00 AM</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMaintenanceMode = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Mode</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Enable Maintenance Mode</label>
              <p className="text-xs text-gray-500">Temporarily disable access to the platform</p>
            </div>
            <button
              onClick={() => updateSettings("maintenance", "enabled", !settings.maintenance.enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.maintenance.enabled ? "bg-red-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.maintenance.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Message</label>
            <textarea
              value={settings.maintenance.message}
              onChange={(e) => updateSettings("maintenance", "message", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter message to display to users during maintenance"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allowed IP Addresses</label>
            <input
              type="text"
              value={settings.maintenance.allowedIPs.join(", ")}
              onChange={(e) => updateSettings("maintenance", "allowedIPs", e.target.value.split(", "))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="192.168.1.1, 10.0.0.1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Comma-separated list of IP addresses that can access during maintenance
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Enforce 2FA for All Users</label>
              <p className="text-xs text-gray-500">Require two-factor authentication for all user accounts</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-blue-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">2FA for Admin Only</label>
              <p className="text-xs text-gray-500">Require 2FA only for administrator accounts</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gray-200">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allowed 2FA Methods</label>
            <div className="space-y-2">
              {["SMS", "Email", "Authenticator App", "Hardware Token"].map((method) => (
                <label key={method} className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{method}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Policy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Password Length</label>
            <input
              type="number"
              defaultValue={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
            <input
              type="number"
              defaultValue={90}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {[
            "Require uppercase letters",
            "Require lowercase letters",
            "Require numbers",
            "Require special characters",
            "Prevent password reuse (last 5)",
          ].map((rule) => (
            <label key={rule} className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{rule}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">IP Restrictions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Enable IP Whitelisting</label>
              <p className="text-xs text-gray-500">Only allow access from approved IP addresses</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gray-200">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allowed IP Ranges</label>
            <textarea
              rows={4}
              placeholder="192.168.1.0/24&#10;10.0.0.0/8&#10;172.16.0.0/12"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Encryption Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Encryption Level</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>AES-256</option>
              <option>AES-192</option>
              <option>AES-128</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SSL/TLS Version</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>TLS 1.3</option>
              <option>TLS 1.2</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Server</label>
            <input
              type="text"
              placeholder="smtp.gmail.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
            <input
              type="number"
              defaultValue={587}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="email"
              placeholder="noreply@brokerplatform.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Test Email Configuration
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SMS Notifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SMS Provider</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Twilio</option>
              <option>AWS SNS</option>
              <option>Nexmo</option>
              <option>MessageBird</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4 font-medium text-gray-700">Event Type</th>
                <th className="text-center py-2 px-4 font-medium text-gray-700">Email</th>
                <th className="text-center py-2 px-4 font-medium text-gray-700">SMS</th>
                <th className="text-center py-2 px-4 font-medium text-gray-700">In-App</th>
                <th className="text-center py-2 px-4 font-medium text-gray-700">Push</th>
              </tr>
            </thead>
            <tbody>
              {[
                "Trade Execution",
                "Account Login",
                "Password Change",
                "Large Transaction",
                "System Maintenance",
                "Market Alert",
                "Company Registration",
                "Compliance Issue",
              ].map((event) => (
                <tr key={event} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">{event}</td>
                  {["email", "sms", "app", "push"].map((type) => (
                    <td key={type} className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderAuditLogs = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Log Retention Period (days)</label>
            <input
              type="number"
              defaultValue={2555}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Regulatory requirement: 7 years (2555 days)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Log Level</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Activities</option>
              <option>Critical Only</option>
              <option>Financial Transactions</option>
              <option>Security Events</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Logged Activities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "User Login/Logout",
            "Trade Executions",
            "Account Changes",
            "Permission Modifications",
            "System Configuration",
            "Data Exports",
            "Failed Login Attempts",
            "Password Changes",
            "Company Registrations",
            "Compliance Actions",
            "Backup Operations",
            "API Access",
          ].map((activity) => (
            <label key={activity} className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{activity}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Audit Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4 font-medium text-gray-700">Timestamp</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">User</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Action</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Resource</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  time: "2024-01-15 14:30:25",
                  user: "admin@broker.com",
                  action: "Updated trading rules",
                  resource: "System Settings",
                  status: "Success",
                },
                {
                  time: "2024-01-15 14:25:12",
                  user: "teller@broker.com",
                  action: "Executed trade",
                  resource: "AAPL Stock",
                  status: "Success",
                },
                {
                  time: "2024-01-15 14:20:08",
                  user: "manager@broker.com",
                  action: "Approved company",
                  resource: "TechCorp Inc.",
                  status: "Success",
                },
                {
                  time: "2024-01-15 14:15:33",
                  user: "unknown",
                  action: "Failed login",
                  resource: "Login System",
                  status: "Failed",
                },
                {
                  time: "2024-01-15 14:10:45",
                  user: "accountant@broker.com",
                  action: "Generated report",
                  resource: "Monthly Report",
                  status: "Success",
                },
              ].map((log, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-600">{log.time}</td>
                  <td className="py-3 px-4 text-sm">{log.user}</td>
                  <td className="py-3 px-4 text-sm">{log.action}</td>
                  <td className="py-3 px-4 text-sm">{log.resource}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        log.status === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Export Audit Logs
          </button>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMonitoringSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">99.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">45ms</div>
            <div className="text-sm text-gray-600">Avg Response</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">1,247</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">23.4GB</div>
            <div className="text-sm text-gray-600">Data Usage</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>CPU Usage</span>
              <span>34%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "34%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Memory Usage</span>
              <span>67%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "67%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Disk Usage</span>
              <span>23%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: "23%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Network I/O</span>
              <span>89%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: "89%" }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Thresholds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CPU Alert Threshold (%)</label>
            <input
              type="number"
              defaultValue={80}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Memory Alert Threshold (%)</label>
            <input
              type="number"
              defaultValue={85}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Response Time Alert (ms)</label>
            <input
              type="number"
              defaultValue={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Error Rate Alert (%)</label>
            <input
              type="number"
              defaultValue={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          {[
            { time: "2 minutes ago", type: "Warning", message: "High memory usage detected (67%)", status: "active" },
            {
              time: "15 minutes ago",
              type: "Info",
              message: "Scheduled backup completed successfully",
              status: "resolved",
            },
            { time: "1 hour ago", type: "Critical", message: "Database connection timeout", status: "resolved" },
            { time: "3 hours ago", type: "Warning", message: "Unusual trading volume detected", status: "resolved" },
          ].map((alert, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-l-4 ${
                alert.type === "Critical"
                  ? "border-red-500 bg-red-50"
                  : alert.type === "Warning"
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-blue-500 bg-blue-50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        alert.type === "Critical"
                          ? "bg-red-100 text-red-800"
                          : alert.type === "Warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {alert.type}
                    </span>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    alert.status === "active" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                  }`}
                >
                  {alert.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderComplianceSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Regulatory Compliance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Jurisdiction</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>United States (SEC)</option>
              <option>European Union (ESMA)</option>
              <option>United Kingdom (FCA)</option>
              <option>Canada (CSA)</option>
              <option>Australia (ASIC)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
            <input
              type="text"
              placeholder="SEC-12345678"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">KYC/AML Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Enhanced Due Diligence</label>
              <p className="text-xs text-gray-500">Require additional verification for high-risk clients</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-blue-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Monitoring Threshold ($)</label>
            <input
              type="number"
              defaultValue={10000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Transactions above this amount require additional scrutiny</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Suspicious Activity Reporting</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Automatic (AI-based)</option>
              <option>Manual Review Required</option>
              <option>Hybrid Approach</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Position Size (%)</label>
            <input
              type="number"
              defaultValue={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Maximum percentage of portfolio in single position</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Daily Loss Limit (%)</label>
            <input
              type="number"
              defaultValue={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Maximum daily loss before trading halt</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reporting Requirements</h3>
        <div className="space-y-4">
          {[
            { name: "Daily Trading Report", frequency: "Daily", status: "Active", lastRun: "2024-01-15 09:00" },
            { name: "Monthly Compliance Report", frequency: "Monthly", status: "Active", lastRun: "2024-01-01 08:00" },
            {
              name: "Quarterly Risk Assessment",
              frequency: "Quarterly",
              status: "Active",
              lastRun: "2024-01-01 10:00",
            },
            { name: "Annual Audit Report", frequency: "Annually", status: "Pending", lastRun: "2023-12-31 16:00" },
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{report.name}</h4>
                <p className="text-sm text-gray-600">
                  Frequency: {report.frequency} | Last run: {report.lastRun}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    report.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {report.status}
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Run Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Alerts</h3>
        <div className="space-y-3">
          {[
            {
              time: "1 hour ago",
              type: "High",
              message: "Large transaction requires manual review: $50,000 TSLA purchase",
              client: "Client #1247",
            },
            {
              time: "3 hours ago",
              type: "Medium",
              message: "KYC documentation expires in 30 days",
              client: "TechCorp Inc.",
            },
            {
              time: "1 day ago",
              type: "Low",
              message: "Monthly compliance report generated successfully",
              client: "System",
            },
          ].map((alert, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-l-4 ${
                alert.type === "High"
                  ? "border-red-500 bg-red-50"
                  : alert.type === "Medium"
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-green-500 bg-green-50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        alert.type === "High"
                          ? "bg-red-100 text-red-800"
                          : alert.type === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {alert.type} Priority
                    </span>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">Related to: {alert.client}</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Review</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Update the renderTabContent function to include all the new sections
  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings()
      case "trading":
        return renderTradingSettings()
      case "companies":
        return renderCompanySettings()
      case "users":
        return renderUserPermissions()
      case "sync":
        return renderDataSync()
      case "backup":
        return renderBackupSettings()
      case "maintenance":
        return renderMaintenanceMode()
      case "security":
        return renderSecuritySettings()
      case "notifications":
        return renderNotificationSettings()
      case "audit":
        return renderAuditLogs()
      case "monitoring":
        return renderMonitoringSettings()
      case "compliance":
        return renderComplianceSettings()
      default:
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coming Soon</h3>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Administrator Settings</h1>
          <p className="text-gray-600 mt-2">Manage your stock broker platform configuration and settings</p>
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
                    onClick={() => setActiveTab(tab.id as TabType)}
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
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}

            {/* Save Button */}
            <div className="mt-8 flex justify-end space-x-4">
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                Reset to Defaults
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
