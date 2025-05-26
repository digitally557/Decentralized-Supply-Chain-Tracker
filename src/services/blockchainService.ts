import { 
  makeContractCall, 
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  stringAsciiCV,
  stringUtf8CV,
  uintCV
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { UserSession } from '@stacks/connect';
import { ItemStatus } from '../types';
import { 
  CONTRACT_ADDRESS, 
  CONTRACT_NAME, 
  FUNCTION_STATUS_UPDATE, 
  FUNCTION_REGISTER_ITEM,
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
  metadata: Record<string, string>
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
      uintCV(0) // Initial status (Created = 0)
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