import React, { useState } from 'react';
import { UserRole, ItemStatus } from '../../types';
import { ROLE_PERMISSIONS, STATUS_INFO } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import { useItems } from '../../contexts/ItemContext';

interface StatusUpdateFormProps {
  itemId: string;
  currentStatus: ItemStatus;
  onSuccess?: () => void;
}

const StatusUpdateForm: React.FC<StatusUpdateFormProps> = ({ 
  itemId, 
  currentStatus,
  onSuccess 
}) => {
  const { userData } = useAuth();
  const { updateItemStatus } = useItems();
  
  const [status, setStatus] = useState<ItemStatus>(currentStatus);
  const [notes, setNotes] = useState('');
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // If user is not authenticated or has no role, show nothing
  if (!userData || !userData.role) {
    return null;
  }
  
  // Get allowed statuses for user's role
  const allowedStatuses = userData.role ? ROLE_PERMISSIONS[userData.role as UserRole] : [];
  
  // Filter out the current status and any previous statuses
  const availableStatuses = allowedStatuses.filter(s => {
    // Get the index of current and potential new status
    const currentIdx = Object.values(ItemStatus).indexOf(currentStatus);
    const newIdx = Object.values(ItemStatus).indexOf(s);
    
    // Only allow moving forward in the supply chain
    return newIdx > currentIdx;
  });
  
  if (availableStatuses.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-gray-600 text-sm">
          You don't have permission to update this item's status further.
        </p>
      </div>
    );
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      // Create location object if location name is provided
      const location = locationName ? {
        name: locationName,
        latitude: 0, // In a real app, we'd get this from geolocation or user input
        longitude: 0,
      } : undefined;
      
      const result = await updateItemStatus({
        itemId,
        status,
        notes: notes.trim() || undefined,
        location,
      });
      
      if (result) {
        setSuccess(true);
        setNotes('');
        setLocationName('');
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError('Failed to update status. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Item Status</h3>
      
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Status updated successfully!
        </div>
      )}
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            New Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ItemStatus)}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          >
            {availableStatuses.map((status) => (
              <option key={status} value={status}>
                {STATUS_INFO[status].label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">{STATUS_INFO[status].description}</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Location (optional)
          </label>
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., Distribution Center, Miami"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={3}
            placeholder="Add any additional information about this status change..."
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating...' : 'Update Status'}
        </button>
      </form>
    </div>
  );
};

export default StatusUpdateForm;