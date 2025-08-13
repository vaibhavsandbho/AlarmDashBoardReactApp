// components/AlarmFilters.jsx
import React, { useState, useEffect } from 'react';
import { Filter, RefreshCw } from 'lucide-react';

export const AlarmFilters = ({ filters, onFilterChange, onClearFilters, onApplyFilters, isLoading }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => onApplyFilters(localFilters);

  const handleClear = () => {
    const cleared = { fromDate: '', toDate: '', status: '', search: '' };
    setLocalFilters(cleared);
    onClearFilters();
  };

  const isValid = () => localFilters.fromDate && localFilters.toDate && localFilters.status;

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="w-5 h-5 mr-2" /> Filters
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium disabled:opacity-50"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            disabled={isLoading || !isValid()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin inline" />
                Filtering...
              </>
            ) : (
              'Apply Filter'
            )}
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* From Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={localFilters.fromDate}
            onChange={(e) => handleChange('fromDate', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={localFilters.toDate}
            onChange={(e) => handleChange('toDate', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            value={localFilters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          >
            <option value="">Select Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            value={localFilters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search alarms..."
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Validation */}
      {!isValid() && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          Please select Status, From Date, and To Date to apply database filters.
        </div>
      )}
    </div>
  );
};
