import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { QualityVerificationPayload } from '../../types';

interface QualityVerificationFormProps {
  itemId: string;
  onSubmit: (payload: QualityVerificationPayload) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const QualityVerificationForm: React.FC<QualityVerificationFormProps> = ({
  itemId,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [qualityScore, setQualityScore] = useState<number>(80);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (qualityScore < 0 || qualityScore > 100) {
      setError('Quality score must be between 0 and 100');
      return;
    }

    if (!notes.trim()) {
      setError('Notes are required for quality verification');
      return;
    }

    try {
      await onSubmit({
        itemId,
        qualityScore,
        notes: notes.trim()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify quality');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 70) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Acceptable';
    if (score >= 60) return 'Poor';
    return 'Failed';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Quality Verification</h3>
        <div className="flex items-center space-x-2">
          {getScoreIcon(qualityScore)}
          <span className={`font-medium ${getScoreColor(qualityScore)}`}>
            {getScoreLabel(qualityScore)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="itemId" className="block text-sm font-medium text-gray-700 mb-2">
            Item ID
          </label>
          <input
            type="text"
            id="itemId"
            value={itemId}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
          />
        </div>

        <div>
          <label htmlFor="qualityScore" className="block text-sm font-medium text-gray-700 mb-2">
            Quality Score (0-100)
          </label>
          <div className="space-y-2">
            <input
              type="range"
              id="qualityScore"
              min="0"
              max="100"
              value={qualityScore}
              onChange={(e) => setQualityScore(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0 (Failed)</span>
              <span className={`font-medium ${getScoreColor(qualityScore)}`}>
                {qualityScore}
              </span>
              <span>100 (Perfect)</span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Verification Notes *
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describe the quality assessment, any issues found, testing methods used, etc."
            required
          />
        </div>

        {qualityScore < 70 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-sm text-red-800 font-medium">
                Quality Score Below Threshold
              </span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              This item will be marked as failing quality verification. Items with scores below 70 may require additional review or corrective action.
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
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Submit Verification'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QualityVerificationForm;
