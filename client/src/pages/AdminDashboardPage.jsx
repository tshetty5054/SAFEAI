import React, { useState, useEffect } from 'react';
import { 
  FaLock, FaUsers, FaExclamationTriangle, FaShieldAlt, 
  FaCalendarCheck, FaChartBar, FaUserCheck 
} from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import axios from 'axios';

// Register Chart.js models
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const API_URL = 'http://localhost:5000/api';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 142,
    totalAlerts: 24,
    activeUsers: 39,
    unsafeZonesCount: 4,
    alertsToday: 2,
    threatDistribution: { Safe: 5, Low: 6, Medium: 8, High: 3, Critical: 2 },
    recentActivity: []
  });

  const [loading, setLoading] = useState(true);

  // Fetch admin analytical statistics
  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/alerts/stats/admin`);
        if (res.data.status === 'success') {
          setStats(res.data.data);
        }
      } catch (err) {
        console.warn('Backend admin stats fetch failed, running standalone mock data.');
        // Pull dummy alert histories to count distributions
        const localAlerts = JSON.parse(localStorage.getItem('mock_alerts_demo_user') || '[]');
        const todayStr = new Date().toISOString().split('T')[0];
        
        const dist = { Safe: 12, Low: 15, Medium: 9, High: 4, Critical: 2 };
        localAlerts.forEach(a => {
          if (dist[a.threatLevel] !== undefined) dist[a.threatLevel]++;
        });

        setStats(prev => ({
          ...prev,
          totalAlerts: localAlerts.length + 42,
          alertsToday: localAlerts.filter(a => a.date === todayStr).length + 1,
          threatDistribution: dist,
          recentActivity: localAlerts.slice(0, 5)
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  // Theme-compliant colors for dark mode dashboards
  const doughnutData = {
    labels: ['Safe', 'Low', 'Medium', 'High', 'Critical'],
    datasets: [{
      data: [
        stats.threatDistribution.Safe || 0,
        stats.threatDistribution.Low || 0,
        stats.threatDistribution.Medium || 0,
        stats.threatDistribution.High || 0,
        stats.threatDistribution.Critical || 0
      ],
      backgroundColor: [
        '#10B981', // emerald
        '#3B82F6', // blue
        '#F59E0B', // amber
        '#EF4444', // red
        '#7F1D1D'  // dark-red
      ],
      borderColor: '#151D30',
      borderWidth: 2
    }]
  };

  const barData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [{
      label: 'Security Alerts Frequency',
      data: [3, 5, 2, 7, 6, 8, stats.alertsToday || 4],
      backgroundColor: 'rgba(239, 68, 68, 0.75)',
      borderColor: '#EF4444',
      borderWidth: 1,
      borderRadius: 6
    }]
  };

  const lineData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [{
      label: 'Hourly Active Watchers',
      data: [15, 8, 25, 42, 38, stats.activeUsers || 35],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      tension: 0.4,
      fill: true
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#9CA3AF', font: { size: 10 } }
      }
    },
    scales: {
      x: { ticks: { color: '#9CA3AF', font: { size: 9 } }, grid: { color: '#1F2E4C' } },
      y: { ticks: { color: '#9CA3AF', font: { size: 9 } }, grid: { color: '#1F2E4C' } }
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center gap-2">
        <FaLock className="text-red-500 text-xl" />
        <h2 className="text-xl font-extrabold text-white">Central Operations Admin Dashboard</h2>
      </div>

      {/* Grid Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel border-safety-border p-5 rounded-2xl flex items-center gap-4">
          <div className="bg-blue-500/10 text-blue-500 p-3 rounded-xl">
            <FaUsers size={20} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold">Total Users</p>
            <h4 className="text-xl font-black text-white">{stats.totalUsers}</h4>
          </div>
        </div>

        <div className="glass-panel border-safety-border p-5 rounded-2xl flex items-center gap-4">
          <div className="bg-red-500/10 text-red-500 p-3 rounded-xl animate-pulse">
            <FaExclamationTriangle size={20} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold">Total Alerts</p>
            <h4 className="text-xl font-black text-white">{stats.totalAlerts}</h4>
          </div>
        </div>

        <div className="glass-panel border-safety-border p-5 rounded-2xl flex items-center gap-4">
          <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-xl">
            <FaUserCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold">Active Load</p>
            <h4 className="text-xl font-black text-white">{stats.activeUsers}</h4>
          </div>
        </div>

        <div className="glass-panel border-safety-border p-5 rounded-2xl flex items-center gap-4">
          <div className="bg-amber-500/10 text-amber-500 p-3 rounded-xl">
            <FaCalendarCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold">Alerts Today</p>
            <h4 className="text-xl font-black text-white">{stats.alertsToday}</h4>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Threat Distribution Chart (Doughnut) */}
        <div className="glass-panel border-safety-border p-5 rounded-2xl flex flex-col h-[300px]">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <FaShieldAlt className="text-red-500" />
            Threat Levels Distribution
          </h3>
          <div className="relative flex-grow flex items-center justify-center">
            <Doughnut 
              data={doughnutData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { color: '#9CA3AF', font: { size: 9 } } }
                }
              }} 
            />
          </div>
        </div>

        {/* Weekly alert volume chart (Bar) */}
        <div className="glass-panel border-safety-border p-5 rounded-2xl flex flex-col h-[300px]">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <FaChartBar className="text-red-500" />
            Weekly Incident Logs
          </h3>
          <div className="relative flex-grow">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* Active traffic chart (Line) */}
        <div className="glass-panel border-safety-border p-5 rounded-2xl flex flex-col h-[300px]">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <FaUsers className="text-blue-500" />
            Hourly Traffic Density
          </h3>
          <div className="relative flex-grow">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

      </div>

      {/* Admin Activity Monitor */}
      <div className="glass-panel border-safety-border p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live System Event Log</h3>

        {stats.recentActivity.length === 0 ? (
          <p className="text-xs text-gray-500 italic text-center py-4">No recent activity packets detected.</p>
        ) : (
          <div className="space-y-2">
            {stats.recentActivity.map(act => (
              <div key={act.id} className="bg-safety-bg/40 border border-safety-border rounded-xl p-3 flex flex-wrap justify-between items-center text-xs">
                <div className="text-left">
                  <span className="font-bold text-white">{act.userName}</span>
                  <span className="text-[10px] text-gray-500 ml-2">{act.date} {act.time}</span>
                  <p className="text-[10px] text-gray-400 mt-1">{act.notes || 'No description notes.'}</p>
                </div>
                <span className="bg-safety-border text-gray-300 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
                  {act.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
