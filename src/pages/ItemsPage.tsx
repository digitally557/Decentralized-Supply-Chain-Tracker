import React from 'react';
import Layout from '../components/layout/Layout';
import ItemList from '../components/items/ItemList';

const ItemsPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-gray-900">All Items</h1>
          <p className="mt-2 text-gray-600">
            Browse and search all items in the supply chain system
          </p>
        </div>
        
        <ItemList />
      </div>
    </Layout>
  );
};

export default ItemsPage;