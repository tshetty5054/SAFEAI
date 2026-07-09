import React, { useState, useEffect } from 'react';
import { FaHistory, FaSearch, FaFilter, FaDownload, FaTrash, FaFileCsv } from 'react-icons/fa';
import { useEmergency } from '../contexts/EmergencyContext';
import axios from 'axios';

export const AlertHistoryPage = () => {
  const { alerts, setAlerts, currentUser } = useEmergency();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Trigger search filter query
  const filteredAlerts = alerts.filter(alert => {
    const term = search.toLowerCase();
    const matchSearch = 
      alert.userName.toLowerCase().includes(term) ||
      (alert.location && alert.location.toLowerCase().includes(term)) ||
      (alert.notes && alert.notes.toLowerCase().includes(term));
    
    const matchStatus = statusFilter === '' || alert.status.toLowerCase() === statusFilter.toLowerCase();
    const matchLevel = levelFilter === '' || alert.threatLevel.toLowerCase() === levelFilter.toLowerCase();

    return matchSearch && matchStatus && matchLevel;
  }).sort((a, b) => {
    let valA = a[sortBy] || '';
    let valB = b[sortBy] || '';
    
    if (sortBy === 'date') {
      const timeA = new Date(`${a.date} ${a.time}`).getTime();
      const timeB = new Date(`${b.date} ${b.time}`).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    }

    if (typeof valA === 'string') {
      return sortOrder === 'desc' ? valB.localeCompare(valA) : valA.localeCompare(valB);
    }
    return sortOrder === 'desc' ? valB - valA : valA - valB;
  });

  // Client Side CSV Exporter
  const handleExportCSV = () => {
    if (filteredAlerts.length === 0) return;

    const headers = [
      'Alert ID', 'User Name', 'Date', 'Time', 
      'Location', 'Latitude', 'Longitude', 
      'Threat Level', 'Threat Confidence %', 
      'Audio Recording Link', 'Status', 'Notes'
    ];

    const rows = filteredAlerts.map(a => [
      a.id,
      a.userName,
      a.date,
      a.time,
      `"${(a.location || '').replace(/"/g, '""')}"`,
      a.lat || '',
      a.lng || '',
      a.threatLevel,
      a.threatConfidence || '',
      a.audioLink || '',
      a.status,
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SAFEAI_AlertHistory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getThreatColor = (level) => {
    switch (level.toLowerCase()) {
      case 'critical': return 'text-red-500 bg-red-950/20 border-red-500/30';
      case 'high': return 'text-red-400 bg-red-950/10 border-red-500/10';
      case 'medium': return 'text-amber-500 bg-amber-950/10 border-amber-500/10';
      case 'low': return 'text-blue-500 bg-blue-950/10 border-blue-500/10';
      default: return 'text-emerald-500 bg-emerald-950/10 border-emerald-500/10';
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FaHistory className="text-red-500 text-xl" />
          <h2 className="text-xl font-extrabold text-white">Alert Log History</h2>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={filteredAlerts.length === 0}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800/40 disabled:text-gray-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
        >
          <FaFileCsv size={12} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Query Filters controls */}
      <div className="glass-panel border-safety-border p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-3.5 text-gray-500 text-xs" />
          <input 
            type="text" 
            placeholder="Search address, notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl pl-8 pr-4 py-2.5 text-xs outline-none transition"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none transition"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Sent">Sent</option>
          <option value="Delivered">Delivered</option>
          <option value="Acknowledged">Acknowledged</option>
          <option value="Resolved">Resolved</option>
        </select>

        {/* Threat Level Filter */}
        <select
          value={levelFilter}
          onChange={e => setLevelFilter(e.target.value)}
          className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none transition"
        >
          <option value="">All Threat Levels</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
          <option value="Safe">Safe</option>
        </select>

        {/* Sort Order Toggle */}
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="flex-grow bg-safety-bg border border-safety-border focus:border-red-500 text-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none transition"
          >
            <option value="date">Sort by Date/Time</option>
            <option value="userName">Sort by User</option>
            <option value="threatLevel">Sort by Threat</option>
            <option value="status">Sort by Status</option>
          </select>
          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="bg-safety-border border border-safety-border text-white text-xs px-3 rounded-xl hover:bg-gray-700"
            title="Toggle Ascending/Descending"
          >
            {sortOrder === 'desc' ? '▼' : '▲'}
          </button>
        </div>

      </div>

      {/* Log Feed List */}
      {filteredAlerts.length === 0 ? (
        <div className="glass-panel border-safety-border rounded-2xl p-12 text-center text-gray-500">
          <p className="text-sm italic">No alerts match the query filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map(alert => (
            <div 
              key={alert.id} 
              className="glass-panel border-safety-border rounded-2xl p-6 hover:border-red-500/20 transition duration-300 space-y-4"
            >
              
              {/* Header block */}
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-extrabold text-sm">{alert.userName}</span>
                    <span className={`text-[9px] px-2 py-0.5 border rounded-full font-bold uppercase tracking-wider ${getThreatColor(alert.threatLevel)}`}>
                      {alert.threatLevel}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono">
                    ID: {alert.id} &bull; {alert.date} &bull; {alert.time}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500 font-semibold">Status:</span>
                  <span className="bg-safety-bg border border-safety-border text-white px-3 py-1 rounded-xl text-[10px] font-bold">
                    {alert.status}
                  </span>
                </div>
              </div>

              {/* Coordinates info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-safety-bg/30 p-3 rounded-xl border border-safety-border/60">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-gray-500 block uppercase font-bold">Recorded Location</span>
                  <span className="text-gray-300 font-mono truncate block">{alert.location}</span>
                </div>
                <div className="space-y-0.5 font-mono">
                  <span className="text-[9px] text-gray-500 block uppercase font-bold">GPS Coordinates</span>
                  <span className="text-gray-300">Lat: {alert.lat ? alert.lat.toFixed(6) : '0'} &bull; Lng: {alert.lng ? alert.lng.toFixed(6) : '0'}</span>
                </div>
              </div>

              {/* Notes */}
              {alert.notes && (
                <div className="text-xs text-gray-400 border-l-2 border-safety-border pl-3 italic">
                  "{alert.notes}"
                </div>
              )}

              {/* Recording link */}
              {alert.audioLink && (
                <div className="text-xs flex items-center gap-2">
                  <span className="text-gray-500">Audio Log Evidence:</span>
                  <a 
                    href={alert.audioLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-red-400 font-bold hover:underline"
                  >
                    Listen to recording
                  </a>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
