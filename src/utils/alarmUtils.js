// utils/alarmUtils.js

// Helper function to show how long ago an alarm occurred
export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Unknown';
  const now = new Date();
  const past = new Date(timestamp);
  const diffInMinutes = Math.floor((now - past) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

export const isSameDay = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// Get alarm styling based on status
export const getAlarmStyles = (isActive, isResolved) => {
  if (isResolved) {
    return { border: 'border-l-green-500', bg: 'bg-green-50', icon: 'text-green-500', pulse: '' };
  }
  if (isActive) {
    return { border: 'border-l-red-500', bg: 'bg-red-50', icon: 'text-red-500', pulse: 'animate-pulse' };
  }
  return { border: 'border-l-gray-400', bg: 'bg-gray-50', icon: 'text-gray-500', pulse: '' };
};

// Calculate alarm statistics
export const calculateAlarmStats = (alarms) => {
  return {
    total: alarms.length,
    active: alarms.filter(a => a.equipmentAlarmStatus === true).length,
    inactive: alarms.filter(a => a.equipmentAlarmStatus === false).length
  };
};

// Sort alarms: Active first, then by occurrence time
export const sortAlarms = (alarms) => {
  return [...alarms].sort((a, b) => {
    if (a.equipmentAlarmStatus !== b.equipmentAlarmStatus) {
      return a.equipmentAlarmStatus ? -1 : 1;
    }
    return new Date(b.alarmOccurredDatetime || 0) - new Date(a.alarmOccurredDatetime || 0);
  });
};

// Apply client-side search on alarm data
export const applyClientSideSearch = (alarmsToSearch, searchTerm) => {
  if (!searchTerm) return alarmsToSearch;
  
  return alarmsToSearch.filter(alarm => {
    const searchLower = searchTerm.toLowerCase();
    const searchableText = [
      alarm.equipmentAlarmName,
      alarm.equipmentAlarmDesc,
      alarm.equipmentName,
      alarm.id?.toString()
    ].filter(Boolean).join(' ').toLowerCase();
    
    return searchableText.includes(searchLower);
  });
};