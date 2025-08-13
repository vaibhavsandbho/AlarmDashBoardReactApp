// components/AlarmCard.jsx
import React from 'react';
import { AlertTriangle, Clock, CheckCircle, User } from 'lucide-react';
import { formatTimeAgo } from '../utils/alarmUtils';

export const AlarmCard = ({ alarm, onAcknowledge }) => {
  const isActive = alarm.equipmentAlarmStatus === true;
  const isResolved = alarm.alarmResolvedDatetime && alarm.alarmResolvedDatetime !== 'NA';

  return (
    <div className={`rounded-xl p-6 border-l-4 ${isActive ? 'border-l-red-500 bg-red-50' : 'border-l-green-500 bg-green-50'
      }`}>
      {/* Alarm Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-bold text-gray-900 text-lg text-[25px]">
              {alarm.equipmentName || 'Unknown Equipment'}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${isActive
              ? 'bg-red-200 text-red-800'
              : 'bg-green-200 text-green-800'
              }`}>
              {isActive ? 'ACTIVE' : 'RESOLVED'}
            </span>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            {alarm.equipmentAlarmDesc || 'No description available'}
          </p>
        </div>
      </div>

      {/* Alarm Details */}
      <div className="flex items-center justify-between text-[20px] font-bold text-gray-500">
        <div className="flex items-center space-x-6">
          {alarm.alarmOccurredDatetime && (
            <div className="flex items-center space-x-2">
              <Clock className="w-7 h-7" />
              <span>Occurred: {formatTimeAgo(alarm.alarmOccurredDatetime)}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-7 h-7" />
            <span>Severity: {alarm.severity || 'Medium'}</span>
          </div>
        </div>

        {isResolved && (
          <div className="flex items-center space-x-2 text-green-700">
            <CheckCircle className="w-7 h-7" />
            <span>Resolved: {formatTimeAgo(alarm.alarmResolvedDatetime)}</span>
          </div>
        )}
      </div>

      {alarm.resolvedBy && (
        <div className="mt-2 text-[20px] font-bold text-green-700">
          <span>Resolved by: {alarm.resolvedBy}</span>
        </div>
      )}



    </div>
  );
};