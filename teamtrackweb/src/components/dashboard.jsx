import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Camera, Users, BarChart3, Settings, LogOut, Bell } from 'lucide-react';

// Shared Dashboard Layout
const DashboardLayout = ({ title, children, role }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">{user?.name || 'User'}</div>
                  <div className="text-xs text-gray-500 capitalize">{role}</div>
                </div>
              </div>
              <button 
                onClick={logout}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

// Admin Dashboard
export const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users, color: 'blue' },
    { label: 'Active Teams', value: '56', icon: Users, color: 'green' },
    { label: 'Today\'s Check-ins', value: '892', icon: Camera, color: 'purple' },
    { label: 'System Health', value: '99.9%', icon: BarChart3, color: 'orange' },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" role="admin">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <div className="font-medium">Manage Users</div>
              <div className="text-sm text-gray-500">Add, edit, or remove users</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <Settings className="w-6 h-6 text-green-600 mb-2" />
              <div className="font-medium">System Settings</div>
              <div className="text-sm text-gray-500">Configure system preferences</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <BarChart3 className="w-6 h-6 text-purple-600 mb-2" />
              <div className="font-medium">View Reports</div>
              <div className="text-sm text-gray-500">Generate detailed analytics</div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Manager Dashboard
export const ManagerDashboard = () => {
  const teamStats = [
    { label: 'Team Members', value: '24', icon: Users, color: 'blue' },
    { label: 'Present Today', value: '20', icon: Camera, color: 'green' },
    { label: 'Active Tasks', value: '15', icon: BarChart3, color: 'purple' },
    { label: 'Completion Rate', value: '87%', icon: BarChart3, color: 'orange' },
  ];

  return (
    <DashboardLayout title="Manager Dashboard" role="manager">
      <div className="space-y-6">
        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamStats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Management */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <div className="font-medium">View Team</div>
              <div className="text-sm text-gray-500">Manage team members and roles</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <Camera className="w-6 h-6 text-green-600 mb-2" />
              <div className="font-medium">Attendance Reports</div>
              <div className="text-sm text-gray-500">View team attendance history</div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// User Dashboard
export const UserDashboard = () => {
  const userStats = [
    { label: 'This Month', value: '22 days', icon: Camera, color: 'green' },
    { label: 'Pending Tasks', value: '5', icon: BarChart3, color: 'orange' },
    { label: 'Completed', value: '18', icon: BarChart3, color: 'blue' },
    { label: 'Hours Logged', value: '176h', icon: BarChart3, color: 'purple' },
  ];

  return (
    <DashboardLayout title="My Dashboard" role="user">
      <div className="space-y-6">
        {/* Personal Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {userStats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <Camera className="w-6 h-6 text-blue-600 mb-2" />
              <div className="font-medium">Check In/Out</div>
              <div className="text-sm text-gray-500">Mark your attendance</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
              <div className="font-medium">My Tasks</div>
              <div className="text-sm text-gray-500">View and manage tasks</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <Settings className="w-6 h-6 text-purple-600 mb-2" />
              <div className="font-medium">Settings</div>
              <div className="text-sm text-gray-500">Update your profile</div>
            </button>
          </div>
        </div>

        {/* Mobile App Download */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">Download Mobile App</h3>
          <p className="text-blue-100 mb-4">
            Get the mobile app for easy selfie check-ins and task management on the go.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Download for iOS
            </button>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Download for Android
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};