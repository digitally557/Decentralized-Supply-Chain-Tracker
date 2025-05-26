import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Package, MapPin } from 'lucide-react';
import { Item } from '../../types';
import { STATUS_INFO } from '../../constants';

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const statusInfo = STATUS_INFO[item.currentStatus];
  const latestEvent = item.events[item.events.length - 1];
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="relative">
        <img 
          src={item.imageUrl || "https://images.pexels.com/photos/5412340/pexels-photo-5412340.jpeg"}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`${statusInfo.color} text-white text-xs font-medium px-2.5 py-1 rounded-full`}>
            {statusInfo.label}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {item.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Package className="w-4 h-4 mr-1" />
            <span>ID: {item.id}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
          {latestEvent.location && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              <span>Last location: {latestEvent.location.name}</span>
            </div>
          )}
        </div>
        
        <Link 
          to={`/items/${item.id}`}
          className="block w-full text-center bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;