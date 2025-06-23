// components/AlarmCard.jsx
import React from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { formatTimeAgo, getAlarmStyles } from '../utils/alarmUtils';

export const AlarmCard = ({ alarm, onAcknowledge }) => {
  const isActive = alarm.equipmentAlarmStatus === true;
  const isResolved = alarm.alarmResolvedDatetime && alarm.alarmResolvedDatetime !== 'NA';
  const styles = getAlarmStyles(isActive, isResolved);

  return (
    <div className={`${styles.border} ${styles.bg} border-l-4 p-6 mb-4 rounded-r-xl shadow-sm ${styles.pulse} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <AlertTriangle className={`${styles.icon} w-6 h-6 mt-1`} />
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-bold text-gray-900 text-lg">{alarm.equipmentName || 'Unknown Equipment'}</h3>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  alarm.equipmentAlarmStatus === true
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {alarm.equipmentAlarmStatus === true ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
            
            <div className="mb-3">
              <p className="font-semibold text-gray-900 mb-1">{alarm.equipmentAlarmName || 'Unnamed Alarm'}</p>
              <p className="text-gray-800 text-base leading-relaxed">{alarm.equipmentAlarmDesc || 'No description available'}</p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Occurred: {alarm.alarmOccurredDatetime ? formatTimeAgo(alarm.alarmOccurredDatetime) : 'Unknown'}</span>
              </div>
              {alarm.alarmResolvedDatetime && alarm.alarmResolvedDatetime !== 'NA' && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Resolved: {formatTimeAgo(alarm.alarmResolvedDatetime)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};