import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageCheck, PackageX, Package, TrendingUp } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useItems } from '../contexts/ItemContext';
import { useAuth } from '../contexts/AuthContext';
import ItemCard from '../components/items/ItemCard';
import { ItemStatus } from '../types';

const Dashboard: React.FC = () => {
  const { isAuthenticated, userData } = useAuth();
  const { items, loading } = useItems();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calculate statistics
  const totalItems = items.length;
  const inTransitItems = items.filter(item => item.currentStatus === ItemStatus.InTransit).length;
  const completedItems = items.filter(item => 
    item.currentStatus === ItemStatus.ReceivedByConsumer || 
    item.currentStatus === ItemStatus.Sold
  ).length;
  
  // Get recent items
  const recentItems = [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
    
  // Filter items based on search
  const filteredItems = searchQuery.trim() 
    ? items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <Layout>
      <div className="bg-primary-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold">
              Supply Chain Tracker
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-lg">
              Track your items securely with blockchain-based verification
            </p>
            
            {!isAuthenticated && (
              <div className="mt-8">
                <Link 
                  to="/items"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md bg-accent-500 hover:bg-accent-600 transition-colors"
                >
                  Browse Items
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Items
                    </dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900">
                        {totalItems}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      In Transit
                    </dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900">
                        {inTransitItems}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PackageCheck className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completed
                    </dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900">
                        {completedItems}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search Section */}
        <div className="mb-12">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Items</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter item name or ID..."
                  className="flex-grow bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <Link
                  to={`/items`}
                  className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-6 rounded-md transition-colors"
                >
                  Advanced Search
                </Link>
              </div>
              
              {searchQuery.trim() && (
                <div className="mt-4">
                  {filteredItems.length > 0 ? (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Search Results:</h3>
                      <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                        {filteredItems.slice(0, 5).map(item => (
                          <li key={item.id} className="px-4 py-3 hover:bg-gray-50">
                            <Link to={`/items/${item.id}`} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-primary-600">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.id}</p>
                              </div>
                              <span className="text-xs text-gray-500">View →</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {filteredItems.length > 5 && (
                        <div className="mt-2 text-right">
                          <Link to="/items" className="text-sm text-primary-600 hover:text-primary-700">
                            View all {filteredItems.length} results →
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">No items found matching "{searchQuery}"</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Recent Items Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Items</h2>
            <Link to="/items" className="text-primary-600 hover:text-primary-700 text-sm">
              View all →
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse-slow flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading items...</p>
              </div>
            </div>
          ) : recentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">No items found. Start by registering a new item.</span>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;