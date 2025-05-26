import React from 'react';
import { ItemEvent, ItemStatus } from '../../types';
import { STATUS_INFO } from '../../constants';

interface TimelineProps {
  events: ItemEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      
      <div className="space-y-8">
        {sortedEvents.map((event, index) => {
          const statusInfo = STATUS_INFO[event.status];
          
          return (
            <div key={event.id} className="relative pl-12 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Timeline dot */}
              <div className={`absolute left-2 top-1.5 w-5 h-5 rounded-full border-4 border-white ${statusInfo.color} transform -translate-x-1/2`}></div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-medium text-gray-900">{statusInfo.label}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{statusInfo.description}</p>
                
                <div className="space-y-1 text-xs text-gray-500">
                  <div>Actor: {event.actor.role}</div>
                  {event.location && (
                    <div>Location: {event.location.name}</div>
                  )}
                  {event.notes && (
                    <div>Notes: {event.notes}</div>
                  )}
                  <div className="text-xs text-gray-400 font-mono truncate">
                    TX: {event.transactionId}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;