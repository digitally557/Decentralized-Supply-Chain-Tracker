import { ItemStatus, UserRole } from '../types';

export const APP_NAME = 'ChainTrack';

// Network configuration
export const NETWORK = {
  testnet: {
    url: 'https://stacks-node-api.testnet.stacks.co',
  },
  mainnet: {
    url: 'https://stacks-node-api.mainnet.stacks.co',
  },
};

export const CURRENT_NETWORK = 'testnet';

// Contract details
export const CONTRACT_ADDRESS = 'ST3PQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW';
export const CONTRACT_NAME = 'supply-chain';
export const FUNCTION_STATUS_UPDATE = 'update-item-status';
export const FUNCTION_REGISTER_ITEM = 'register-item';

// Role permissions for status updates
export const ROLE_PERMISSIONS: Record<UserRole, ItemStatus[]> = {
  [UserRole.Manufacturer]: [
    ItemStatus.Created,
    ItemStatus.Manufacturing,
    ItemStatus.Manufactured,
    ItemStatus.PackagingStarted,
    ItemStatus.Packaged,
  ],
  [UserRole.Shipper]: [
    ItemStatus.ShippingStarted,
    ItemStatus.InTransit,
    ItemStatus.Delivered,
  ],
  [UserRole.Retailer]: [
    ItemStatus.ReceivedByRetailer,
    ItemStatus.ForSale,
    ItemStatus.Sold,
  ],
  [UserRole.Consumer]: [
    ItemStatus.ReceivedByConsumer,
  ],
  [UserRole.Admin]: [
    ItemStatus.Created,
    ItemStatus.Manufacturing,
    ItemStatus.Manufactured,
    ItemStatus.PackagingStarted,
    ItemStatus.Packaged,
    ItemStatus.ShippingStarted,
    ItemStatus.InTransit,
    ItemStatus.Delivered,
    ItemStatus.ReceivedByRetailer,
    ItemStatus.ForSale,
    ItemStatus.Sold,
    ItemStatus.ReceivedByConsumer,
  ],
  [UserRole.Unknown]: [],
};

// Status display information
export const STATUS_INFO: Record<ItemStatus, { label: string, color: string, description: string }> = {
  [ItemStatus.Created]: {
    label: 'Created',
    color: 'bg-blue-500',
    description: 'Item has been registered in the system',
  },
  [ItemStatus.Manufacturing]: {
    label: 'Manufacturing',
    color: 'bg-purple-500',
    description: 'Item is being manufactured',
  },
  [ItemStatus.Manufactured]: {
    label: 'Manufactured',
    color: 'bg-indigo-500',
    description: 'Manufacturing is complete',
  },
  [ItemStatus.PackagingStarted]: {
    label: 'Packaging Started',
    color: 'bg-fuchsia-500',
    description: 'Item is being packaged',
  },
  [ItemStatus.Packaged]: {
    label: 'Packaged',
    color: 'bg-pink-500',
    description: 'Item has been packaged',
  },
  [ItemStatus.ShippingStarted]: {
    label: 'Shipping Started',
    color: 'bg-orange-500',
    description: 'Item has begun shipping process',
  },
  [ItemStatus.InTransit]: {
    label: 'In Transit',
    color: 'bg-amber-500',
    description: 'Item is on the way',
  },
  [ItemStatus.Delivered]: {
    label: 'Delivered',
    color: 'bg-yellow-500',
    description: 'Item has been delivered',
  },
  [ItemStatus.ReceivedByRetailer]: {
    label: 'Received by Retailer',
    color: 'bg-lime-500',
    description: 'Retailer has received the item',
  },
  [ItemStatus.ForSale]: {
    label: 'For Sale',
    color: 'bg-green-500',
    description: 'Item is available for purchase',
  },
  [ItemStatus.Sold]: {
    label: 'Sold',
    color: 'bg-emerald-500',
    description: 'Item has been sold',
  },
  [ItemStatus.ReceivedByConsumer]: {
    label: 'Received by Consumer',
    color: 'bg-teal-500',
    description: 'Consumer has received the item',
  },
};

// Sample mock data
export const MOCK_ITEMS = [
  {
    id: "item-001",
    name: "Premium Coffee Beans",
    description: "100% Arabica coffee beans from Colombia",
    imageUrl: "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg",
    currentStatus: ItemStatus.ForSale,
    createdAt: "2023-01-15T08:30:00Z",
    metadata: {
      origin: "Colombia",
      batchNumber: "CB-2023-01-15-001",
      weight: "1kg",
    },
    events: [
      {
        id: "event-001",
        itemId: "item-001",
        status: ItemStatus.Created,
        timestamp: "2023-01-15T08:30:00Z",
        actor: {
          address: "ST1PQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW",
          role: UserRole.Manufacturer,
        },
        transactionId: "0x123456789abcdef",
      },
      {
        id: "event-002",
        itemId: "item-001",
        status: ItemStatus.Manufactured,
        timestamp: "2023-01-16T10:15:00Z",
        actor: {
          address: "ST1PQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW",
          role: UserRole.Manufacturer,
        },
        location: {
          latitude: 4.7110,
          longitude: -74.0721,
          name: "Coffee Farm, Colombia",
        },
        transactionId: "0x123456789abcdef1",
      },
      {
        id: "event-003",
        itemId: "item-001",
        status: ItemStatus.Packaged,
        timestamp: "2023-01-17T14:20:00Z",
        actor: {
          address: "ST1PQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW",
          role: UserRole.Manufacturer,
        },
        location: {
          latitude: 4.7110,
          longitude: -74.0721,
          name: "Packaging Facility, Colombia",
        },
        transactionId: "0x123456789abcdef2",
      },
      {
        id: "event-004",
        itemId: "item-001",
        status: ItemStatus.InTransit,
        timestamp: "2023-01-20T09:45:00Z",
        actor: {
          address: "ST2MQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW",
          role: UserRole.Shipper,
        },
        location: {
          latitude: 25.7617,
          longitude: -80.1918,
          name: "Port of Miami, USA",
        },
        notes: "Shipment arrived at port",
        transactionId: "0x123456789abcdef3",
      },
      {
        id: "event-005",
        itemId: "item-001",
        status: ItemStatus.Delivered,
        timestamp: "2023-01-25T11:30:00Z",
        actor: {
          address: "ST2MQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW",
          role: UserRole.Shipper,
        },
        location: {
          latitude: 34.0522,
          longitude: -118.2437,
          name: "Los Angeles Distribution Center",
        },
        transactionId: "0x123456789abcdef4",
      },
      {
        id: "event-006",
        itemId: "item-001",
        status: ItemStatus.ReceivedByRetailer,
        timestamp: "2023-01-26T09:15:00Z",
        actor: {
          address: "ST3MQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW",
          role: UserRole.Retailer,
        },
        location: {
          latitude: 34.0522,
          longitude: -118.2437,
          name: "Gourmet Coffee Shop, Los Angeles",
        },
        transactionId: "0x123456789abcdef5",
      },
      {
        id: "event-007",
        itemId: "item-001",
        status: ItemStatus.ForSale,
        timestamp: "2023-01-27T14:10:00Z",
        actor: {
          address: "ST3MQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW",
          role: UserRole.Retailer,
        },
        location: {
          latitude: 34.0522,
          longitude: -118.2437,
          name: "Gourmet Coffee Shop, Los Angeles",
        },
        transactionId: "0x123456789abcdef6",
      },
    ],
  },
  {
    id: "item-002",
    name: "Organic Cotton T-Shirt",
    description: "100% organic cotton, sustainably sourced",
    imageUrl: "https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg",
    currentStatus: ItemStatus.Sold,
    createdAt: "2023-02-10T10:15:00Z",
    metadata: {
      material: "Organic Cotton",
      size: "Medium",
      color: "Natural White",
      batchNumber: "OC-2023-02-10-005",
    },
    events: [
      {
        id: "event-008",
        itemId: "item-002",
        status: ItemStatus.Created,
        timestamp: "2023-02-10T10:15:00Z",
        actor: {
          address: "ST1PQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW",
          role: UserRole.Manufacturer,
        },
        transactionId: "0x223456789abcdef",
      },
      {
        id: "event-009",
        itemId: "item-002",
        status: ItemStatus.Manufactured,
        timestamp: "2023-02-15T14:30:00Z",
        actor: {
          address: "ST1PQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW",
          role: UserRole.Manufacturer,
        },
        location: {
          latitude: 23.8103,
          longitude: 90.4125,
          name: "Textile Factory, Bangladesh",
        },
        transactionId: "0x223456789abcdef1",
      },
      {
        id: "event-010",
        itemId: "item-002",
        status: ItemStatus.Packaged,
        timestamp: "2023-02-17T09:45:00Z",
        actor: {
          address: "ST1PQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW",
          role: UserRole.Manufacturer,
        },
        location: {
          latitude: 23.8103,
          longitude: 90.4125,
          name: "Packaging Facility, Bangladesh",
        },
        transactionId: "0x223456789abcdef2",
      },
      {
        id: "event-011",
        itemId: "item-002",
        status: ItemStatus.InTransit,
        timestamp: "2023-02-20T08:30:00Z",
        actor: {
          address: "ST2MQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW",
          role: UserRole.Shipper,
        },
        location: {
          latitude: 22.3569,
          longitude: 91.7832,
          name: "Port of Chittagong, Bangladesh",
        },
        transactionId: "0x223456789abcdef3",
      },
      {
        id: "event-012",
        itemId: "item-002",
        status: ItemStatus.Delivered,
        timestamp: "2023-03-05T11:15:00Z",
        actor: {
          address: "ST2MQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW",
          role: UserRole.Shipper,
        },
        location: {
          latitude: 51.5074,
          longitude: -0.1278,
          name: "London Distribution Center, UK",
        },
        transactionId: "0x223456789abcdef4",
      },
      {
        id: "event-013",
        itemId: "item-002",
        status: ItemStatus.ReceivedByRetailer,
        timestamp: "2023-03-07T09:30:00Z",
        actor: {
          address: "ST3MQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW",
          role: UserRole.Retailer,
        },
        location: {
          latitude: 51.5142,
          longitude: -0.1390,
          name: "Sustainable Fashion Store, London",
        },
        transactionId: "0x223456789abcdef5",
      },
      {
        id: "event-014",
        itemId: "item-002",
        status: ItemStatus.ForSale,
        timestamp: "2023-03-08T14:20:00Z",
        actor: {
          address: "ST3MQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW",
          role: UserRole.Retailer,
        },
        location: {
          latitude: 51.5142,
          longitude: -0.1390,
          name: "Sustainable Fashion Store, London",
        },
        transactionId: "0x223456789abcdef6",
      },
      {
        id: "event-015",
        itemId: "item-002",
        status: ItemStatus.Sold,
        timestamp: "2023-03-10T16:45:00Z",
        actor: {
          address: "ST3MQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW",
          role: UserRole.Retailer,
        },
        location: {
          latitude: 51.5142,
          longitude: -0.1390,
          name: "Sustainable Fashion Store, London",
        },
        transactionId: "0x223456789abcdef7",
      },
    ],
  },
  {
    id: "item-003",
    name: "Organic Avocados",
    description: "Fresh organic avocados from Mexico",
    imageUrl: "https://images.pexels.com/photos/2228553/pexels-photo-2228553.jpeg",
    currentStatus: ItemStatus.InTransit,
    createdAt: "2023-04-05T09:20:00Z",
    metadata: {
      origin: "Mexico",
      variety: "Hass",
      farmId: "ORG-FARM-123",
      batchNumber: "AV-2023-04-05-002",
    },
    events: [
      {
        id: "event-016",
        itemId: "item-003",
        status: ItemStatus.Created,
        timestamp: "2023-04-05T09:20:00Z",
        actor: {
          address: "ST1PQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW",
          role: UserRole.Manufacturer,
        },
        transactionId: "0x323456789abcdef",
      },
      {
        id: "event-017",
        itemId: "item-003",
        status: ItemStatus.Manufactured,
        timestamp: "2023-04-05T15:45:00Z",
        actor: {
          address: "ST1PQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW",
          role: UserRole.Manufacturer,
        },
        location: {
          latitude: 19.4326,
          longitude: -99.1332,
          name: "Organic Farm, Mexico",
        },
        notes: "Harvested at peak ripeness",
        transactionId: "0x323456789abcdef1",
      },
      {
        id: "event-018",
        itemId: "item-003",
        status: ItemStatus.Packaged,
        timestamp: "2023-04-06T10:30:00Z",
        actor: {
          address: "ST1PQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW",
          role: UserRole.Manufacturer,
        },
        location: {
          latitude: 19.4326,
          longitude: -99.1332,
          name: "Packaging Facility, Mexico",
        },
        transactionId: "0x323456789abcdef2",
      },
      {
        id: "event-019",
        itemId: "item-003",
        status: ItemStatus.ShippingStarted,
        timestamp: "2023-04-07T08:15:00Z",
        actor: {
          address: "ST2MQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW",
          role: UserRole.Shipper,
        },
        location: {
          latitude: 19.4326,
          longitude: -99.1332,
          name: "Distribution Center, Mexico City",
        },
        transactionId: "0x323456789abcdef3",
      },
      {
        id: "event-020",
        itemId: "item-003",
        status: ItemStatus.InTransit,
        timestamp: "2023-04-08T09:30:00Z",
        actor: {
          address: "ST2MQNWVZ0T5GP5Z1D389ZKECZWC1P3HKY5DG5BW",
          role: UserRole.Shipper,
        },
        location: {
          latitude: 25.7617,
          longitude: -80.1918,
          name: "International Shipping Route",
        },
        notes: "Temperature-controlled container",
        transactionId: "0x323456789abcdef4",
      },
    ],
  }
];