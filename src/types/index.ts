export interface User {
  address: string;
  role: UserRole;
}

export enum UserRole {
  Manufacturer = "manufacturer",
  Shipper = "shipper",
  Retailer = "retailer",
  Consumer = "consumer",
  Inspector = "inspector",
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
  batchId?: number;
  qualityVerified: boolean;
  requiresApproval: boolean;
  approvalCount: number;
  requiredApprovals: number;
  qualityVerifications: QualityVerification[];
  approvals: Approval[];
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

export interface QualityVerification {
  id: string;
  itemId: string;
  inspector: {
    address: string;
    role: UserRole;
  };
  verified: boolean;
  qualityScore: number;
  notes: string;
  timestamp: string;
  transactionId: string;
}

export interface Approval {
  id: string;
  itemId: string;
  approver: {
    address: string;
    role: UserRole;
  };
  approved: boolean;
  notes: string;
  timestamp: string;
  transactionId: string;
}

export interface Batch {
  id: number;
  name: string;
  creator: {
    address: string;
    role: UserRole;
  };
  createdAt: string;
  status: ItemStatus;
  itemCount: number;
  items: string[];
}

export interface QualityVerificationPayload {
  itemId: string;
  qualityScore: number;
  notes: string;
}

export interface ApprovalPayload {
  itemId: string;
  notes: string;
}

export interface BatchCreatePayload {
  name: string;
}

export interface BatchUpdatePayload {
  itemIds: string[];
  status: ItemStatus;
  notes: string;
  location?: {
    latitude: number;
    longitude: number;
    name: string;
  };
}