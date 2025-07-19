import React, { useState } from 'react';
import { CheckCircle, XCircle, Users, Clock } from 'lucide-react';
import { ApprovalPayload, Item } from '../../types';

interface ApprovalFormProps {
  item: Item;
  onSubmit: (payload: ApprovalPayload) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const ApprovalForm: React.FC<ApprovalFormProps> = ({
  item,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!notes.trim()) {
      setError('Approval notes are required');
      return;
    }

    try {
      await onSubmit({
        itemId: item.id,
        notes: notes.trim()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit approval');
    }
  };

  const approvalProgress = item.requiredApprovals > 0 
    ? (item.approvalCount / item.requiredApprovals) * 100 
    : 0;

  const isFullyApproved = item.approvalCount >= item.requiredApprovals;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Item Approval</h3>
        <div className="flex items-center space-x-2">
          {isFullyApproved ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Clock className="w-5 h-5 text-yellow-600" />
          )}
          <span className={`font-medium ${isFullyApproved ? 'text-green-600' : 'text-yellow-600'}`}>
            {isFullyApproved ? 'Fully Approved' : 'Pending Approval'}
          </span>
        </div>
      </div>

      {/* Item Information */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-900 mb-2">{item.name}</h4>
        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Item ID:</span>
            <span className="ml-2 text-gray-600">{item.id}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Current Status:</span>
            <span className="ml-2 text-gray-600">{item.currentStatus}</span>
          </div>
        </div>
      </div>

      {/* Approval Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Approval Progress</span>
          </div>
          <span className="text-sm text-gray-600">
            {item.approvalCount} of {item.requiredApprovals} approvals
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isFullyApproved ? 'bg-green-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${Math.min(approvalProgress, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Existing Approvals */}
      {item.approvals && item.approvals.length > 0 && (
        <div className="mb-6">
          <h5 className="text-sm font-medium text-gray-700 mb-3">Previous Approvals</h5>
          <div className="space-y-2">
            {item.approvals.map((approval, index) => (
              <div key={approval.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {approval.approver.address.slice(0, 8)}...{approval.approver.address.slice(-4)}
                    </p>
                    <p className="text-xs text-gray-600">{approval.notes}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(approval.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Approval Notes *
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Provide details about your approval decision, any conditions, or requirements..."
            required
          />
        </div>

        {isFullyApproved && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm text-green-800 font-medium">
                Item Already Fully Approved
              </span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              This item has received all required approvals. Additional approvals can still be added for documentation purposes.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !notes.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Approval'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApprovalForm;
