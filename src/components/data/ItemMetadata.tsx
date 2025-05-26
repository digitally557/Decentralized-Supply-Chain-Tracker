import React from 'react';
import { Item } from '../../types';

interface ItemMetadataProps {
  item: Item;
}

const ItemMetadata: React.FC<ItemMetadataProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-700">Item Metadata</h3>
      </div>
      
      <div className="p-4">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">ID</dt>
            <dd className="mt-1 text-sm text-gray-900 font-mono">{item.id}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Created</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(item.createdAt).toLocaleString()}
            </dd>
          </div>
          
          {Object.entries(item.metadata).map(([key, value]) => (
            <div key={key} className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default ItemMetadata;