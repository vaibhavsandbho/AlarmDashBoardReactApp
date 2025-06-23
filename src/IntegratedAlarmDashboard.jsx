
"use client";
// IntegratedAlarmDashboard.jsx
import React, { useRef } from 'react';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

// Custom hooks
import { useAlarmData } from './hooks/useAlarmData';

// Components
import { AlarmStats } from './components/AlarmStats';
import { AlarmFilters } from './components/AlarmFilters';
import { AlarmCard } from './components/AlarmCard';

// Utils
import { sortAlarms } from './utils/alarmUtils';

// Main integrated dashboard component
export default function IntegratedAlarmDashboard() {
  const containerRef = useRef(null);
  
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

  // Sort alarms for display
  const sortedAlarms = sortAlarms(displayedAlarms);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Connecting to real-time alarm stream...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                Equipment Alarm Dashboard
              </h1>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-gray-600">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-500' : 
                    connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`text-xs font-medium ${
                    connectionStatus === 'connected' ? 'text-green-600' : 
                    connectionStatus === 'connecting' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {connectionStatus === 'connected' ? 'Real-time Connected' : 
                     connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                  </span>
                </div>
                {isFilterMode && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Filtered Results
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {connectionStatus === 'disconnected' && (
                <button 
                  onClick={handleReconnect}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reconnect
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AlarmStats alarms={displayedAlarms} />
        
        <AlarmFilters 
          filters={filters} 
          onFilterChange={handleFilterChange}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          isLoading={filterLoading}
        />

        {/* Alarms List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Equipment Alarms ({displayedAlarms.length})
              {isFilterMode ? (
                <span className="text-sm font-normal text-blue-600 ml-2">(Database Filtered)</span>
              ) : (
                <span className="text-sm font-normal text-green-600 ml-2"></span>
              )}
            </h2>
            {displayedAlarms.length > 0 && (
              <div className="text-sm text-gray-500">
                {sortedAlarms.filter(a => a.equipmentAlarmStatus === true).length} active, {' '}
                {sortedAlarms.filter(a => a.equipmentAlarmStatus === false).length} inactive
              </div>
            )}
          </div>
          
          {sortedAlarms.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No alarms found</h3>
              <p className="text-gray-500">
                {isFilterMode 
                  ? 'No alarms match your filter criteria. Try adjusting your filters.' 
                  : connectionStatus === 'connected'
                    ? 'All systems are operating normally. Real-time monitoring active.'
                    : 'Waiting for real-time connection...'}
              </p>
            </div>
          ) : (
            <div 
              ref={containerRef}
              className="space-y-4 max-h-96 overflow-y-auto"
              style={{ maxHeight: '600px' }}
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
  );
}