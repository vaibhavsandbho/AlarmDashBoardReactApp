"use client";
// IntegratedAlarmDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle, RefreshCw, Search, Calendar, X } from 'lucide-react';
import { generateAlarmPdf } from '@/utils/pdfGenerator';
import { AlarmService } from '@/services/alarmService'; // Import AlarmService
// Custom hooks
import { useAlarmData } from './hooks/useAlarmData';

// Components
import { AlarmStats } from './components/AlarmStats';
import { AlarmCard } from './components/AlarmCard';// IntegratedAlarmDashboard.jsx
import { generateExcelReport } from "./utils/ExcelReportGenratater";


// Utils
import { sortAlarms, applyClientSideSearch, filterAlarmsByTab, getAlarmCounts, applyDateRangeFilter, getDatePresets } from './utils/alarmUtils';

// Main integrated dashboard component
export default function IntegratedAlarmDashboard() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [displayedAlarms, setDisplayedAlarms] = useState([]);  // State to store the fetched alarms
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use custom hook to manage other alarm-related state and logic
  const { filters, filterLoading, connectionStatus, handleReconnect, handleAcknowledge } = useAlarmData();

  // Fetch filtered alarms from backend when filter changes
  const fetchFilteredAlarms = async () => {
    setLoading(true);
    setError(null);  // Reset the error state before fetching
    const filterParams = {
      status: '',  // You can adjust the status parameter based on requirements
      fromDate: dateRange.from,
      toDate: dateRange.to,
    };

    try {
      const alarms = await AlarmService.fetchFilteredAlarms(filterParams);  // Fetch filtered alarms from backend
      setDisplayedAlarms(alarms);  // Update displayedAlarms with the fetched data
    } catch (error) {
      console.error('Failed to load filtered alarms:', error);
      setError('Failed to load filtered alarms');
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetchFilteredAlarms whenever date range changes
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchFilteredAlarms();
    }
  }, [dateRange]);  // Fetch data when date range changes

  // Apply client-side search and filtering
  const dateFiltered = applyDateRangeFilter(displayedAlarms, dateRange.from, dateRange.to);
  const searchFiltered = applyClientSideSearch(dateFiltered, searchTerm);
  const tabFiltered = filterAlarmsByTab(searchFiltered, activeTab);
  const sortedAlarms = sortAlarms(tabFiltered);

  // Final filtered list to pass to the PDF generator
  const alarmList = sortedAlarms.length > 0 ? sortedAlarms : displayedAlarms;

  // Calculate stats from original data
  const alarmCounts = getAlarmCounts(displayedAlarms);

  // Date presets
  const datePresets = getDatePresets();

  // Handle date preset selection
  const handleDatePreset = (preset) => {
    setDateRange({ from: preset.from, to: preset.to });
  };

  // Clear date filter
  const clearDateFilter = () => {
    setDateRange({ from: '', to: '' });
  };

  // Check if date filter is active
  const isDateFilterActive = dateRange.from || dateRange.to;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Connecting to real-time alarm stream...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 p-2" style={{ background: '#2F5597' }}>
      {/* Header */}
      <div className="relative bg-white rounded-2xl shadow-lg mb-1 px-2 py-2" style={{ background: '#ffd900e1', height: '90px' }}>
        {/* Larger Image */}
        <img
          src="/assets/MM-images.png"
          alt="mahindra-logo"
          style={{
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translateY(-50%)',
            width: '130px',
            height: 'auto',
          }}
        />

        {/* Centered Title */}
        <div className="flex items-center justify-center mt-4">
          <h1 className="text-3xl font-bold text-gray-800 m-0 p-0 leading-tight">Equipment Alarm Dashboard</h1>
        </div>

        {/* Status Row */}
        <div className="flex items-center justify-between text-xs text-gray-600 py-0.5" style={{ paddingLeft: '200px' }}>
          <div className="flex items-center space-x-1">
            <div
              className={`w-2 h-2 rounded-full ${connectionStatus === 'connected'
                ? 'bg-green-500'
                : connectionStatus === 'connecting'
                ? 'bg-yellow-500'
                : 'bg-red-500'
              }`}
            ></div>
            <span className="m-0 p-0 text-base">Last updated: {new Date().toLocaleTimeString()}</span>
          </div>

          <div className="flex items-center space-x-1 mr-45">
            <span className="m-0 p-0 text-base">Auto-refresh: ON</span>
          </div>

          {connectionStatus === 'disconnected' && (
            <button
              onClick={handleReconnect}
              className="flex items-center px-2 py-0.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Reconnect
            </button>
          )}
        </div>

        <img
          src="/assets/ats-logo.png"
          alt="ats-logo"
          style={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            width: '130px',
            height: 'auto',
          }}
        />
      </div>

      {/* PDF & Excel Download Buttons */}
      <div className="col-m-8" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginLeft: '1950px', marginTop: '20px' }}>
        <button
          onClick={() => generateExcelReport(alarmList)} // Ensure it's the filtered data here
          style={{
            backgroundColor: '#207245',
            color: 'white',
            border: 'none',
            padding: '6px 16px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            height: '36px',
          }}
        >
          📊 Excel Download
        </button>

        <button
          onClick={() => generateAlarmPdf(alarmList, 'Mahindra Admin')} // Ensure it's the filtered data here
          style={{
            backgroundColor: '#D93025',
            color: 'white',
            border: 'none',
            padding: '6px 16px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            height: '36px',
          }}
        >
          📄 PDF Download
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <AlarmStats alarms={displayedAlarms} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-4 gap-6" style={{ background: '#2F5597' }}>
        {/* Left Content - Equipment Alarms */}
        <div className="col-span-3 mt-10">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[760px]">
            {/* Header with Tabs */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Equipment Alarms ({alarmCounts.total})
                </h2>

                {/* Date Filter Button */}
                <button
                  onClick={() => setShowDateFilter(!showDateFilter)}  // Toggle Date Filter visibility
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isDateFilterActive
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Date Filter
                  {isDateFilterActive && (
                    <span className="ml-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </button>
              </div>
            </div>

            {/* Date Filter Dropdown (only visible if showDateFilter is true) */}
            {showDateFilter && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Filter by Date Range</h3>
                  <button
                    onClick={() => setShowDateFilter(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Date Inputs */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">From Date</label>
                    <input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">To Date</label>
                    <input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Clear Date Filter */}
                {isDateFilterActive && (
                  <button
                    onClick={clearDateFilter}
                    className="w-full px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Clear Date Filter
                  </button>
                )}
              </div>
            )}

            {/* Alarms List */}
            <div className="px-6 pt-6 pb-2">
              {sortedAlarms.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No alarms found</h3>
                  <p className="text-gray-500">
                    {error ? 'Error fetching data' : 'All systems are operating normally.'}
                  </p>
                </div>
              ) : (
                <div ref={containerRef} className="space-y-4 max-h-[540px] overflow-y-auto pr-2">
                  {sortedAlarms.map((alarm, index) => (
                    <AlarmCard key={alarm.id || index} alarm={alarm} onAcknowledge={handleAcknowledge} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
