export interface User {
  address: string;
  role: UserRole;
}

export enum UserRole {
  Manufacturer = "manufacturer",
  Shipper = "shipper",
  Retailer = "retailer",
  Consumer = "consumer",
  Admin = "admin",
  Unknown = "unknown"
}

export interface Item {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  currentStatus: ItemStatus;
  events: ItemEvent[];
  createdAt: string;
  metadata: Record<string, string>;
}

export enum ItemStatus {
  Created = "created",
  Manufacturing = "manufacturing",
  Manufactured = "manufactured",
  PackagingStarted = "packaging_started",
  Packaged = "packaged",
  ShippingStarted = "shipping_started",
  InTransit = "in_transit",
  Delivered = "delivered",
  ReceivedByRetailer = "received_by_retailer",
  ForSale = "for_sale",
  Sold = "sold",
  ReceivedByConsumer = "received_by_consumer"
}

export interface ItemEvent {
  id: string;
  itemId: string;
  status: ItemStatus;
  timestamp: string;
  actor: {
    address: string;
    role: UserRole;
  };
  location?: {
    latitude: number;
    longitude: number;
    name: string;
  };
  notes?: string;
  transactionId: string;
}

export interface StatusUpdatePayload {
  itemId: string;
  status: ItemStatus;
  notes?: string;
  location?: {
    latitude: number;
    longitude: number;
    name: string;
  };
}