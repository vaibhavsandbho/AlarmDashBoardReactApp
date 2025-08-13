// utils/alarmUtils.js

export const formatTimeAgo = (datetime) => {
  if (!datetime || datetime === 'NA') return 'Unknown';
  
  const now = new Date();
  const past = new Date(datetime);
  const diffInMinutes = Math.floor((now - past) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

export const calculateAlarmStats = (alarms) => {
  if (!alarms || !Array.isArray(alarms)) {
    return { total: 0, active: 0, inactive: 0 };
  }

  const total = alarms.length;
  const active = alarms.filter(alarm => alarm.equipmentAlarmStatus === true).length;
  const inactive = alarms.filter(alarm => alarm.equipmentAlarmStatus === false).length;

  return { total, active, inactive };
};

export const sortAlarms = (alarms) => {
  if (!alarms || !Array.isArray(alarms)) return [];
  
  return [...alarms].sort((a, b) => {
    // Sort by status first (active alarms first)
    if (a.equipmentAlarmStatus !== b.equipmentAlarmStatus) {
      return b.equipmentAlarmStatus - a.equipmentAlarmStatus;
    }
    
    // Then by occurrence time (most recent first)
    const timeA = new Date(a.alarmOccurredDatetime || 0);
    const timeB = new Date(b.alarmOccurredDatetime || 0);
    return timeB - timeA;
  });
};

export const getAlarmStyles = (isActive, isResolved) => {
  if (isActive) {
    return {
      border: 'border-l-red-500',
      bg: 'bg-red-50',
      icon: 'text-red-600',
      pulse: 'animate-pulse'
    };
  } else if (isResolved) {
    return {
      border: 'border-l-green-500',
      bg: 'bg-green-50',
      icon: 'text-green-600',
      pulse: ''
    };
  } else {
    return {
      border: 'border-l-gray-300',
      bg: 'bg-gray-50',
      icon: 'text-gray-600',
      pulse: ''
    };
  }
};

export const getSeverityColor = (severity) => {
  const colors = {
    'Critical': 'bg-red-100 text-red-700 border-red-200',
    'Major': 'bg-orange-100 text-orange-700 border-orange-200',  
    'Minor': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Warning': 'bg-blue-100 text-blue-700 border-blue-200'
  };
  return colors[severity] || 'bg-gray-100 text-gray-700 border-gray-200';
};

export const applyClientSideSearch = (alarms, searchTerm) => {
  if (!searchTerm || !alarms) return alarms;
  
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  return alarms.filter(alarm => {
    const equipmentName = (alarm.equipmentName || '').toLowerCase();
    const alarmName = (alarm.equipmentAlarmName || '').toLowerCase();
    const alarmDesc = (alarm.equipmentAlarmDesc || '').toLowerCase();
    const severity = (alarm.severity || '').toLowerCase();
    const assignedTo = (alarm.assignedTo || '').toLowerCase();
    
    return equipmentName.includes(normalizedSearch) ||
           alarmName.includes(normalizedSearch) ||
           alarmDesc.includes(normalizedSearch) ||
           severity.includes(normalizedSearch) ||
           assignedTo.includes(normalizedSearch);
  });
};

export const filterAlarmsByTab = (alarms, activeTab) => {
  if (!alarms || !Array.isArray(alarms)) return [];
  
  switch (activeTab) {
    case 'Active':
      return alarms.filter(alarm => alarm.equipmentAlarmStatus === true);
    case 'Critical':
      return alarms.filter(alarm => alarm.severity === 'Critical');
    case 'All':
    default:
      return alarms;
  }
};

export const getAlarmCounts = (alarms) => {
  if (!alarms || !Array.isArray(alarms)) {
    return { total: 0, active: 0, critical: 0, resolved: 0 };
  }
  
  const total = alarms.length;
  const active = alarms.filter(alarm => alarm.equipmentAlarmStatus === true).length;
  const critical = alarms.filter(alarm => alarm.severity === 'Critical').length;
  const resolved = alarms.filter(alarm => alarm.equipmentAlarmStatus === false).length;
  
  return { total, active, critical, resolved };
};

export const applyDateRangeFilter = (alarms, fromDate, toDate) => {
  if (!alarms || !Array.isArray(alarms)) return [];
  if (!fromDate && !toDate) return alarms;
  
  return alarms.filter(alarm => {
    const alarmDate = new Date(alarm.alarmOccurredDatetime);
    
    // Handle invalid dates
    if (isNaN(alarmDate.getTime())) return false;
    
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    
    // Set time to end of day for 'to' date to include the entire day
    if (to) {
      to.setHours(23, 59, 59, 999);
    }
    
    // Set time to start of day for 'from' date
    if (from) {
      from.setHours(0, 0, 0, 0);
    }
    
    if (from && to) {
      return alarmDate >= from && alarmDate <= to;
    } else if (from) {
      return alarmDate >= from;
    } else if (to) {
      return alarmDate <= to;
    }
    
    return true;
  });
};

export const getDatePresets = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  const formatDate = (date) => date.toISOString().split('T')[0];
  
  return {
    today: { label: 'Today', from: formatDate(today), to: formatDate(today) },
    yesterday: { label: 'Yesterday', from: formatDate(yesterday), to: formatDate(yesterday) },
    lastWeek: { label: 'Last 7 Days', from: formatDate(lastWeek), to: formatDate(today) },
    lastMonth: { label: 'Last 30 Days', from: formatDate(lastMonth), to: formatDate(today) }
  };
};