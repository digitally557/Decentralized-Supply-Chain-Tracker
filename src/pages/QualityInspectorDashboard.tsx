import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react';
import { useItems } from '../contexts/ItemContext';
import { useAuth } from '../contexts/AuthContext';
import { Item, UserRole, QualityVerificationPayload } from '../types';
import QualityVerificationForm from '../components/quality/QualityVerificationForm';
import { verifyQuality } from '../services/blockchainService';

const QualityInspectorDashboard: React.FC = () => {
  const { items, loading } = useItems();
  const { userData, userSession } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);

  // Check if user is authorized
  const isAuthorized = userData?.role === UserRole.Inspector || userData?.role === UserRole.Admin;

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'verified' && item.qualityVerified) ||
                         (statusFilter === 'unverified' && !item.qualityVerified) ||
                         (statusFilter === 'needs_verification' && requiresVerification(item));
    
    return matchesSearch && matchesStatus;
  });

  const requiresVerification = (item: Item): boolean => {
    // Items that are manufactured, packaged, or delivered typically need quality verification
    const statusesRequiringVerification = ['manufactured', 'packaged', 'delivered'];
    return statusesRequiringVerification.includes(item.currentStatus) && !item.qualityVerified;
  };

  const handleVerifyQuality = async (payload: QualityVerificationPayload) => {
    if (!userSession || !isAuthorized) {
      throw new Error('Unauthorized to verify quality');
    }

    setVerificationLoading(true);
    try {
      await verifyQuality(userSession, payload);
      setShowVerificationForm(false);
      setSelectedItem(null);
      // In a real app, you would refresh the items list here
    } catch (error) {
      throw error;
    } finally {
      setVerificationLoading(false);
    }
  };

  const getQualityStatusIcon = (item: Item) => {
    if (item.qualityVerified) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (requiresVerification(item)) {
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    } else {
      return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getQualityStatusText = (item: Item) => {
    if (item.qualityVerified) {
      return 'Verified';
    } else if (requiresVerification(item)) {
      return 'Needs Verification';
    } else {
      return 'Not Required';
    }
  };

  const getQualityStatusColor = (item: Item) => {
    if (item.qualityVerified) {
      return 'text-green-600 bg-green-50';
    } else if (requiresVerification(item)) {
      return 'text-yellow-600 bg-yellow-50';
    } else {
      return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need Inspector or Admin role to access this dashboard.</p>
        </div>
      </div>
    );
  }

  if (showVerificationForm && selectedItem) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <QualityVerificationForm
            itemId={selectedItem.id}
            onSubmit={handleVerifyQuality}
            onCancel={() => {
              setShowVerificationForm(false);
              setSelectedItem(null);
            }}
            loading={verificationLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Quality Inspector Dashboard</h1>
            <p className="mt-2 text-gray-600">Verify and manage item quality across the supply chain</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Items</option>
                <option value="needs_verification">Needs Verification</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading items...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.id}</p>
                    </div>
                    {getQualityStatusIcon(item)}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span className="font-medium">{item.currentStatus}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Quality:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityStatusColor(item)}`}>
                        {getQualityStatusText(item)}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    {requiresVerification(item) && (
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowVerificationForm(true);
                        }}
                        className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verify
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QualityInspectorDashboard;
