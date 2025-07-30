import React, { useState } from 'react';
import EmployeeList from '@/pages/admin/sections/EmployeeList';
import TaskReports from '@/pages/admin/sections/TaskReports';
import AttendanceReport from '@/pages/admin/sections/AttendanceReport';
import GeoSettings from '@/pages/admin/sections/GeoSettings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('employees');

  return (
    <div className="p-4">
      {/* Tab navigation */}
      <div className="flex space-x-4 border-b pb-2 mb-4">
        <button
          onClick={() => setActiveTab('employees')}
          className={activeTab === 'employees' ? 'font-bold' : ''}
        >
          Employees
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={activeTab === 'tasks' ? 'font-bold' : ''}
        >
          Task Reports
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={activeTab === 'attendance' ? 'font-bold' : ''}
        >
          Attendance
        </button>
        <button
          onClick={() => setActiveTab('geofencing')}
          className={activeTab === 'geofencing' ? 'font-bold' : ''}
        >
          Geo Settings
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'employees' && <EmployeeList />}
      {activeTab === 'tasks' && <TaskReports />}
      {activeTab === 'attendance' && <AttendanceReport />}
      {activeTab === 'geofencing' && <GeoSettings />}
    </div>
  );
};

export default AdminDashboard;
