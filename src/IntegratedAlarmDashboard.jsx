"use client";
// IntegratedAlarmDashboard.jsx
import React, { useRef, useState } from 'react';
import { AlertTriangle, CheckCircle, RefreshCw, Search, Calendar, X } from 'lucide-react';

// Custom hooks
import { useAlarmData } from './hooks/useAlarmData';

// Components
import { AlarmStats } from './components/AlarmStats';
import { AlarmFilters } from './components/AlarmFilters';
import { AlarmCard } from './components/AlarmCard';

// Utils
import { sortAlarms, applyClientSideSearch, filterAlarmsByTab, getAlarmCounts, applyDateRangeFilter, getDatePresets } from './utils/alarmUtils';

// Main integrated dashboard component
export default function IntegratedAlarmDashboard() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  // Use custom hook to manage all alarm-related state and logic
  const {
    displayedAlarms,
    filters,
    filterLoading,
    loading,
    error,
    lastUpdated,
    isFilterMode,
    connectionStatus,
    handleApplyFilters,
    handleClearFilters,
    handleFilterChange,
    handleReconnect,
    handleAcknowledge
  } = useAlarmData();

  // Apply client-side search and filtering
  const dateFiltered = applyDateRangeFilter(displayedAlarms, dateRange.from, dateRange.to);
  const searchFiltered = applyClientSideSearch(dateFiltered, searchTerm);
  const tabFiltered = filterAlarmsByTab(searchFiltered, activeTab);
  const sortedAlarms = sortAlarms(tabFiltered);

  {/* Choose the list you want to show status for */ }
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
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 flex items-center justify-center" >
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Connecting to real-time alarm stream...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 p-2"
      style={{ background: '#2F5597' }}
    >
      {/* Header */}
      <div
        className="relative bg-white rounded-2xl shadow-lg mb-1 px-2 py-2"
        style={{ background: '#ffd900e1', height: '90px' }}
      >
        {/* Bigger image, absolutely positioned */}
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

        {/* Centered Title with left padding so it doesn't overlap the image */}
        <div className="flex items-center justify-center mt-4">
          <h1 className="text-3xl font-bold text-gray-800 m-0 p-0 leading-tight">
            Equipment Alarm Dashboard
          </h1>
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
            <span className="m-0 p-0  text-base">Last updated: {lastUpdated.toLocaleTimeString()}</span>
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
          alt="mahindra-logo"
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
      <div className="grid grid-cols-4 gap-6" style={{
        background: '#2F5597'
      }}>
        {/* Left Content - Equipment Alarms */}
        <div className="col-span-3 mt-10">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[760px]">

            {/* Header with Tabs */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Equipment Alarms ({tabFiltered.length})
                  {isFilterMode && (
                    <span className="text-sm font-normal text-blue-600 ml-2">(Database Filtered)</span>
                  )}
                  {isDateFilterActive && (
                    <span className="text-sm font-normal text-green-600 ml-2">(Date Filtered)</span>
                  )}
                </h2>

                <div className="flex items-center space-x-3">
                  {/* Date Filter Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDateFilter(!showDateFilter)}
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

                    {/* Date Filter Dropdown */}
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

                        {/* Date Presets */}
                        <div className="mb-4">
                          <label className="block text-xs font-medium text-gray-700 mb-2">Quick Select</label>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(datePresets).map(([key, preset]) => (
                              <button
                                key={key}
                                onClick={() => handleDatePreset(preset)}
                                className="px-3 py-2 text-xs font-medium bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Clear Filter */}
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
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search equipment..."
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-1">
                {['All', 'Active'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {tab}
                    <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">
                      {tab === 'All' ? alarmCounts.total :
                        tab === 'Active' ? alarmCounts.active :
                          alarmCounts.critical}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Alarms List */}
            <div className="px-6 pt-6 pb-2">
              {sortedAlarms.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No alarms found</h3>
                  <p className="text-gray-500">
                    {isFilterMode
                      ? 'No alarms match your filter criteria.'
                      : connectionStatus === 'connected'
                        ? 'All systems are operating normally.'
                        : 'Waiting for real-time connection...'}
                  </p>
                </div>
              ) : (
                <div
                  ref={containerRef}
                  className="space-y-4 max-h-[540px] overflow-y-auto pr-2"
                >
                  {sortedAlarms.map((alarm, index) => (
                    <AlarmCard
                      key={alarm.id || index}
                      alarm={alarm}
                      onAcknowledge={handleAcknowledge}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Right Sidebar */}
        {/* Equipment Status */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mt-10 w-[88%] mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Equipment Status
          </h3>

          <div className="space-y-3 max-h-[635px] overflow-y-auto pr-1 pb-0">
            {[...new Set(alarmList.map(alarm => alarm.equipmentName))].map((equipmentName) => {
              const count = alarmList.filter(a => a.equipmentName === equipmentName).length;
              return (
                <div
                  key={equipmentName}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <p className="text-sm font-medium text-gray-900">{equipmentName}</p>
                  <p className="text-lg font-bold text-gray-900">{count}</p>
                </div>
              );
            })}

            {/* If no alarms found */}
            {alarmList.length === 0 && (
              <div className="text-center py-1">
                <p className="text-gray-500">No equipment found</p>
              </div>
            )}
          </div>
        </div>


      </div>

    </div>



  );

}
