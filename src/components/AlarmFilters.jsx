// components/AlarmFilters.jsx
import React, { useState, useEffect } from 'react';
import { Filter, RefreshCw } from 'lucide-react';

export const AlarmFilters = ({ filters, onFilterChange, onClearFilters, onApplyFilters, isLoading }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleLocalFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = { fromDate: '', toDate: '', status: '', search: '' };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const isFiltersValid = () => {
    return localFilters.fromDate && localFilters.toDate;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
           Filters
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={handleClearFilters} 
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
            disabled={isLoading}
          >
            Clear All
          </button>
          <button 
            onClick={handleApplyFilters}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin inline" />
                Filtering...
              </>
            ) : (
              'Apply Database Filter'
            )}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={localFilters.fromDate}
            onChange={(e) => handleLocalFilterChange('fromDate', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={localFilters.toDate}
            onChange={(e) => handleLocalFilterChange('toDate', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            value={localFilters.status}
            onChange={(e) => handleLocalFilterChange('status', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          >
            <option value="">Select Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search 
          </label>
          <input
            type="text"
            value={localFilters.search}
            onChange={(e) => handleLocalFilterChange('search', e.target.value)}
            placeholder="Search in results..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>
      </div>
      
      {!isFiltersValid() && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Please select Status, From Date, and To Date to apply database filters.
          </p>
        </div>
      )}
    </div>
  );
};