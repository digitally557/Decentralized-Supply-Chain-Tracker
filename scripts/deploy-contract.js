import { 
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  TxBroadcastResultOk,
  TxBroadcastResultRejected
} from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const STACKS_PRIVATE_KEY = process.env.STACKS_PRIVATE_KEY;
const CONTRACT_NAME = 'supply-chain';

if (!STACKS_PRIVATE_KEY) {
  console.error('Missing STACKS_PRIVATE_KEY environment variable');
  process.exit(1);
}

async function deployContract() {
  const network = new StacksTestnet();
  const contractSource = fs.readFileSync('./contracts/supply-chain.clar').toString();
  
  const txOptions = {
    contractName: CONTRACT_NAME,
    codeBody: contractSource,
    senderKey: STACKS_PRIVATE_KEY,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 100000, // Set an appropriate fee
  };
  
  const transaction = await makeContractDeploy(txOptions);
  
  console.log('Deploying contract...');
  
  try {
    const broadcastResponse = await broadcastTransaction(transaction, network);
    
    if ('txid' in broadcastResponse) {
      console.log('Contract deployment transaction broadcasted successfully!');
      console.log('Transaction ID:', broadcastResponse.txid);
      console.log('You can monitor the transaction at:');
      console.log(`https://explorer.stacks.co/txid/${broadcastResponse.txid}?chain=testnet`);
    } else {
      console.error('Failed to deploy contract:', broadcastResponse.error);
    }
  } catch (error) {
    console.error('Error broadcasting transaction:', error);
  }
}

deployContract()
  .catch(console.error);