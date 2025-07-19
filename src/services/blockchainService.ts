import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  stringAsciiCV,
  stringUtf8CV,
  uintCV,
  noneCV,
  someCV,
  listCV,
  principalCV
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { UserSession } from '@stacks/connect';
import { ItemStatus, UserRole, QualityVerificationPayload, ApprovalPayload, BatchCreatePayload } from '../types';
import {
  CONTRACT_ADDRESS,
  CONTRACT_NAME,
  FUNCTION_STATUS_UPDATE,
  FUNCTION_REGISTER_ITEM,
  FUNCTION_VERIFY_QUALITY,
  FUNCTION_APPROVE_ITEM,
  FUNCTION_CREATE_BATCH,
  FUNCTION_BATCH_UPDATE,
  FUNCTION_SET_USER_ROLE,
  CURRENT_NETWORK
} from '../constants';

// Get the appropriate network
const getNetwork = () => {
  return CURRENT_NETWORK === 'mainnet' 
    ? new StacksMainnet() 
    : new StacksTestnet();
};

export const registerItem = async (
  userSession: UserSession,
  itemId: string,
  name: string,
  description: string,
  metadata: Record<string, string>,
  batchId?: number
): Promise<string> => {
  const network = getNetwork();
  const senderAddress = userSession.loadUserData().profile.stxAddress[CURRENT_NETWORK];

  // Convert metadata to string
  const metadataString = JSON.stringify(metadata);

  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: FUNCTION_REGISTER_ITEM,
    functionArgs: [
      stringAsciiCV(itemId),
      stringUtf8CV(name),
      stringUtf8CV(description),
      stringUtf8CV(metadataString),
      batchId ? someCV(uintCV(batchId)) : noneCV()
    ],
    senderKey: '', // This will be filled by the connect library
    validateWithAbi: true,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);

  if (broadcastResponse.error) {
    throw new Error(broadcastResponse.error);
  }

  return broadcastResponse.txid;
};

export const updateItemStatus = async (
  userSession: UserSession,
  itemId: string,
  status: ItemStatus,
  notes: string,
  location: string
): Promise<string> => {
  const network = getNetwork();
  const senderAddress = userSession.loadUserData().profile.stxAddress[CURRENT_NETWORK];

  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: FUNCTION_STATUS_UPDATE,
    functionArgs: [
      stringAsciiCV(itemId),
      uintCV(Object.values(ItemStatus).indexOf(status)),
      stringUtf8CV(notes),
      stringUtf8CV(location)
    ],
    senderKey: '', // This will be filled by the connect library
    validateWithAbi: true,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);

  if (broadcastResponse.error) {
    throw new Error(broadcastResponse.error);
  }

  return broadcastResponse.txid;
};

export const verifyQuality = async (
  userSession: UserSession,
  payload: QualityVerificationPayload
): Promise<string> => {
  const network = getNetwork();

  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: FUNCTION_VERIFY_QUALITY,
    functionArgs: [
      stringAsciiCV(payload.itemId),
      uintCV(payload.qualityScore),
      stringUtf8CV(payload.notes)
    ],
    senderKey: '',
    validateWithAbi: true,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);

  if (broadcastResponse.error) {
    throw new Error(broadcastResponse.error);
  }

  return broadcastResponse.txid;
};

export const approveItem = async (
  userSession: UserSession,
  payload: ApprovalPayload
): Promise<string> => {
  const network = getNetwork();

  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: FUNCTION_APPROVE_ITEM,
    functionArgs: [
      stringAsciiCV(payload.itemId),
      stringUtf8CV(payload.notes)
    ],
    senderKey: '',
    validateWithAbi: true,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);

  if (broadcastResponse.error) {
    throw new Error(broadcastResponse.error);
  }

  return broadcastResponse.txid;
};

export const createBatch = async (
  userSession: UserSession,
  payload: BatchCreatePayload
): Promise<string> => {
  const network = getNetwork();

  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: FUNCTION_CREATE_BATCH,
    functionArgs: [
      stringUtf8CV(payload.name)
    ],
    senderKey: '',
    validateWithAbi: true,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);

  if (broadcastResponse.error) {
    throw new Error(broadcastResponse.error);
  }

  return broadcastResponse.txid;
};

export const setUserRole = async (
  userSession: UserSession,
  userAddress: string,
  role: UserRole
): Promise<string> => {
  const network = getNetwork();

  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: FUNCTION_SET_USER_ROLE,
    functionArgs: [
      principalCV(userAddress),
      stringAsciiCV(role)
    ],
    senderKey: '',
    validateWithAbi: true,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);

  if (broadcastResponse.error) {
    throw new Error(broadcastResponse.error);
  }

  return broadcastResponse.txid;
};