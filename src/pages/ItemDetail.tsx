import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PackageCheck, ArrowLeft, QrCode } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Timeline from '../components/timeline/Timeline';
import StatusBadge from '../components/status/StatusBadge';
import StatusUpdateForm from '../components/status/StatusUpdateForm';
import ItemMetadata from '../components/data/ItemMetadata';
import QRCodeGenerator from '../components/scan/QRCodeGenerator';
import { useItems } from '../contexts/ItemContext';
import { useAuth } from '../contexts/AuthContext';

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getItem, loading, error } = useItems();
  const { isAuthenticated } = useAuth();
  const [showQRCode, setShowQRCode] = useState(false);
  
  const item = id ? getItem(id) : undefined;
  
  // Scroll to top when navigating to this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse-slow flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading item details...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!item) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Item not found!</strong>
            <span className="block sm:inline"> The item with ID {id} could not be found.</span>
            <div className="mt-4">
              <Link to="/items" className="text-primary-600 hover:text-primary-700">
                ← Back to items
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="bg-primary-500 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center">
                <Link to="/items" className="mr-2 text-white opacity-75 hover:opacity-100">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-heading font-bold">{item.name}</h1>
              </div>
              <p className="mt-1 text-sm text-white text-opacity-80 font-mono">{item.id}</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <StatusBadge status={item.currentStatus} size="lg" />
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-colors"
                aria-label="Show QR Code"
              >
                <QrCode className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Item Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="relative">
                <img 
                  src={item.imageUrl || "https://images.pexels.com/photos/5412340/pexels-photo-5412340.jpeg"}
                  alt={item.name}
                  className="w-full h-64 object-cover"
                />
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Item Details</h2>
                <p className="text-gray-700 mb-6">{item.description}</p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Current Status</h3>
                  <div className="flex items-center">
                    <PackageCheck className="h-6 w-6 text-primary-500 mr-2" />
                    <StatusBadge status={item.currentStatus} />
                  </div>
                </div>
                
                <ItemMetadata item={item} />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Item History</h2>
                <Timeline events={item.events} />
              </div>
            </div>
          </div>
          
          {/* Right Column - Actions and QR Code */}
          <div className="lg:col-span-1 space-y-8">
            {isAuthenticated && (
              <StatusUpdateForm itemId={item.id} currentStatus={item.currentStatus} />
            )}
            
            {showQRCode && (
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">QR Code</h3>
                <div className="flex justify-center">
                  <QRCodeGenerator itemId={item.id} size={200} />
                </div>
                <p className="text-center mt-4 text-sm text-gray-600">
                  Print this QR code and attach it to the physical item for easy tracking.
                </p>
              </div>
            )}
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Blockchain Verification</h3>
              <p className="text-gray-600 text-sm mb-4">
                This item's history is securely stored on the Stacks blockchain, ensuring 
                immutable and transparent record-keeping.
              </p>
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Latest Transaction</h4>
                <div className="bg-gray-50 p-2 rounded font-mono text-xs text-gray-600 break-all">
                  {item.events[item.events.length - 1].transactionId}
                </div>
                <a 
                  href={`https://explorer.stacks.co/txid/${item.events[item.events.length - 1].transactionId}?chain=testnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center mt-3 text-sm text-primary-600 hover:text-primary-700"
                >
                  View on Blockchain Explorer →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;