import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Item, StatusUpdatePayload, ItemStatus } from '../types';
import { MOCK_ITEMS } from '../constants';

interface ItemContextType {
  items: Item[];
  loading: boolean;
  error: string | null;
  getItem: (id: string) => Item | undefined;
  updateItemStatus: (payload: StatusUpdatePayload) => Promise<boolean>;
  registerItem: (item: Partial<Item>) => Promise<string | null>;
  searchItems: (query: string) => Item[];
}

const ItemContext = createContext<ItemContextType>({
  items: [],
  loading: false,
  error: null,
  getItem: () => undefined,
  updateItemStatus: async () => false,
  registerItem: async () => null,
  searchItems: () => [],
});

export const useItems = () => useContext(ItemContext);

interface ItemProviderProps {
  children: ReactNode;
}

export const ItemProvider: React.FC<ItemProviderProps> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real implementation, we would fetch items from the blockchain or API
    // For now, we'll use mock data
    const fetchItems = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setItems(MOCK_ITEMS);
        setError(null);
      } catch (err) {
        setError('Failed to fetch items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const getItem = (id: string) => {
    return items.find(item => item.id === id);
  };

  const updateItemStatus = async (payload: StatusUpdatePayload): Promise<boolean> => {
    try {
      setLoading(true);
      
      // In a real implementation, we would call the Stacks blockchain
      // For now, we'll just update our local state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setItems(prevItems => 
        prevItems.map(item => {
          if (item.id === payload.itemId) {
            const newEvent = {
              id: `event-${Date.now()}`,
              itemId: payload.itemId,
              status: payload.status,
              timestamp: new Date().toISOString(),
              actor: {
                address: 'ST1PQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW', // This would come from auth context
                role: 'admin', // This would come from auth context
              },
              location: payload.location,
              notes: payload.notes,
              transactionId: `0x${Math.random().toString(16).substr(2, 40)}`,
            };
            
            return {
              ...item,
              currentStatus: payload.status,
              events: [...item.events, newEvent],
            };
          }
          return item;
        })
      );
      
      return true;
    } catch (err) {
      setError('Failed to update item status');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const registerItem = async (itemData: Partial<Item>): Promise<string | null> => {
    try {
      setLoading(true);
      
      // In a real implementation, we would call the Stacks blockchain
      // For now, we'll just update our local state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newItemId = `item-${Date.now()}`;
      const newItem: Item = {
        id: newItemId,
        name: itemData.name || 'New Item',
        description: itemData.description || '',
        imageUrl: itemData.imageUrl,
        currentStatus: ItemStatus.Created,
        events: [
          {
            id: `event-${Date.now()}`,
            itemId: newItemId,
            status: ItemStatus.Created,
            timestamp: new Date().toISOString(),
            actor: {
              address: 'ST1PQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW', // This would come from auth context
              role: 'admin', // This would come from auth context
            },
            transactionId: `0x${Math.random().toString(16).substr(2, 40)}`,
          }
        ],
        createdAt: new Date().toISOString(),
        metadata: itemData.metadata || {},
      };
      
      setItems(prevItems => [...prevItems, newItem]);
      
      return newItemId;
    } catch (err) {
      setError('Failed to register item');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const searchItems = (query: string): Item[] => {
    if (!query.trim()) return items;
    
    const lowerQuery = query.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.id.toLowerCase().includes(lowerQuery) ||
      Object.values(item.metadata).some(value => 
        value.toLowerCase().includes(lowerQuery)
      )
    );
  };

  return (
    <ItemContext.Provider
      value={{
        items,
        loading,
        error,
        getItem,
        updateItemStatus,
        registerItem,
        searchItems,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};