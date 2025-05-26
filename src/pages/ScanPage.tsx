import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanLine, QrCode } from 'lucide-react';
import Layout from '../components/layout/Layout';

const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [itemId, setItemId] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemId.trim()) {
      setError('Please enter an item ID');
      return;
    }
    
    // Navigate to the item detail page
    navigate(`/items/${itemId.trim()}`);
  };
  
  // In a real application, we would implement QR code scanning here
  // For this demo, we'll just provide manual entry
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-heading font-bold text-gray-900">Scan Item</h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Scan a QR code or enter an item ID manually to view its supply chain history
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gray-100 rounded-full">
                  <ScanLine className="h-12 w-12 text-primary-500" />
                </div>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-gray-600">
                  Use the camera on your device to scan a QR code
                </p>
              </div>
              
              <button
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 mb-4"
                onClick={() => alert('QR code scanning would be implemented here in a production app')}
              >
                Scan QR Code
              </button>
              
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-600">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Manual Entry</h2>
              
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              <form onSubmit={handleManualSearch}>
                <div className="mb-4">
                  <label htmlFor="itemId" className="block text-sm font-medium text-gray-700 mb-1">
                    Item ID
                  </label>
                  <input
                    type="text"
                    id="itemId"
                    value={itemId}
                    onChange={(e) => {
                      setItemId(e.target.value);
                      setError(null);
                    }}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter item ID (e.g., item-001)"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-accent-500 hover:bg-accent-600 text-white font-medium py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 flex justify-center items-center"
                >
                  <QrCode className="h-5 w-5 mr-2" />
                  Find Item
                </button>
              </form>
              
              <div className="mt-4">
                <p className="text-xs text-gray-500 text-center">
                  Try these example IDs: item-001, item-002, item-003
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScanPage;