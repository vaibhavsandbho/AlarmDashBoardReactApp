// hooks/useAlarmData.js
import { useState, useEffect, useRef } from 'react';
import { AlarmService, SSEConnectionManager } from '../services/alarmService';
import { applyClientSideSearch } from '../utils/alarmUtils';

export const useAlarmData = () => {
  const [activeAlarms, setActiveAlarms] = useState([]);
  const [resolvedAlarms, setResolvedAlarms] = useState([]);
  const [allAlarms, setAllAlarms] = useState([]);
  const [displayedAlarms, setDisplayedAlarms] = useState([]);
  const [filters, setFilters] = useState({ fromDate: '', toDate: '', status: '', search: '' });
  const [filterLoading, setFilterLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isFilterMode, setIsFilterMode] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  
  const sseManagerRef = useRef(null);

  // SSE Connection Effect
  useEffect(() => {
    const handleSSEUpdate = (data) => {
      const activelist = data.activelist || [];
      const resolvedlist = data.resolvedlist || [];

      setActiveAlarms(activelist);
      setResolvedAlarms(resolvedlist);

      // Combine both lists for display (if not in filter mode)
      if (!isFilterMode) {
        const combined = [...activelist, ...resolvedlist];
        setAllAlarms(combined);
        setDisplayedAlarms(combined);
      }

      setLastUpdated(new Date());
      setError('');
    };

    const handleSSEError = (errorMessage) => {
      setError(errorMessage);
    };

    const handleStatusChange = (status) => {
      setConnectionStatus(status);
      if (status === 'connected') {
        setLoading(false);
      }
    };

    // Initialize SSE connection
    sseManagerRef.current = new SSEConnectionManager(
      handleSSEUpdate,
      handleSSEError,
      handleStatusChange
    );

    sseManagerRef.current.connect();

    // Cleanup function
    return () => {
      if (sseManagerRef.current) {
        sseManagerRef.current.disconnect();
      }
    };
  }, [isFilterMode]);

  // Apply client-side search changes (real-time)
  useEffect(() => {
    const searchFiltered = applyClientSideSearch(allAlarms, filters.search);
    setDisplayedAlarms(searchFiltered);
  }, [filters.search, allAlarms]);

  // Fetch filtered alarms from database
  const fetchFilteredAlarms = async (filterParams) => {
    setFilterLoading(true);
    setIsFilterMode(true);
    
    try {
      const data = await AlarmService.fetchFilteredAlarms(filterParams);
      setAllAlarms(data);
      
      // Apply client-side search if provided
      const searchFiltered = applyClientSideSearch(data, filterParams.search);
      setDisplayedAlarms(searchFiltered);
      
      setLastUpdated(new Date());
      
    } catch (error) {
      setError(error.message);
    } finally {
      setFilterLoading(false);
    }
  };

  // Apply database filters
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    fetchFilteredAlarms(newFilters);
  };

  // Clear all filters and return to SSE mode
  const handleClearFilters = () => {
    const clearedFilters = { fromDate: '', toDate: '', status: '', search: '' };
    setFilters(clearedFilters);
    setIsFilterMode(false);
    
    // Return to showing SSE data
    const combined = [...activeAlarms, ...resolvedAlarms];
    setAllAlarms(combined);
    setDisplayedAlarms(combined);
  };

  // Handle filter change for search (real-time)
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Reconnect SSE manually
  const handleReconnect = () => {
    if (sseManagerRef.current) {
      sseManagerRef.current.reconnect();
    }
  };

  // Handle alarm acknowledgment
  const handleAcknowledge = async (alarmId) => {
    try {
      await AlarmService.acknowledgeAlarm(alarmId);
      console.log(`Alarm ${alarmId} acknowledged successfully`);
    } catch (error) {
      console.error('Failed to acknowledge alarm:', error);
      setError('Failed to acknowledge alarm');
    }
  };

  return {
    // State
    displayedAlarms,
    filters,
    filterLoading,
    loading,
    error,
    lastUpdated,
    isFilterMode,
    connectionStatus,
    
    // Handlers
    handleApplyFilters,
    handleClearFilters,
    handleFilterChange,
    handleReconnect,
    handleAcknowledge
  };
};