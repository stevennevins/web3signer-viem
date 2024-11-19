import { toAccount } from 'viem/accounts';
import axios from 'axios';
import type { TransactionSerializable } from 'viem';
import dotenv from 'dotenv';

dotenv.config();

const address = process.env.SIGNER_ADDRESS as `0x${string}`;
const signerUrl = process.env.WEB3_SIGNER_URL;

if (!signerUrl) {
  throw new Error('WEB3_SIGNER_URL environment variable is not set');
}

// Create a custom account using toAccount
export const web3SignerAccount = toAccount({
  address,
  // Sign a message using Web3Signer
  async signMessage({ message }) {
    console.log('eth_sign request:');
    console.log('address:', address);
    console.log('message:', message);

    const response = await axios.post(signerUrl, {
      jsonrpc: '2.0',
      method: 'eth_sign',
      params: [address, message],
      id: 1,
    });
    console.log(response)
    return response.data.result;
  },
  // Sign typed data using Web3Signer
  async signTypedData(params) {
    console.log('eth_signTypedData request:');
    console.log('address:', address);
    console.log('params:', params);

    const response = await axios.post(signerUrl, {
      jsonrpc: '2.0',
      method: 'eth_signTypedData',
      params: [address, params],
      id: 1,
    });
    console.log(response)
    return response.data.result;
  },
  // Sign a transaction using Web3Signer
  async signTransaction(transaction, { serializer } = {}) {
    console.log('eth_signTransaction request:');
    // Format transaction params according to web3signer spec
    const txParams = {
      from: address,
      to: transaction.to,
      gas: transaction.gas?.toString(),
      gasPrice: transaction.gasPrice?.toString(),
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas?.toString(),
      maxFeePerGas: transaction.maxFeePerGas?.toString(),
      nonce: transaction.nonce?.toString(),
      value: transaction.value?.toString(),
      data: transaction.data
    };

    console.log('txParams:', txParams);

    const response = await axios.post(signerUrl, {
      jsonrpc: '2.0',
      method: 'eth_signTransaction',
      params: [txParams],
      id: 1,
    });

    console.log(response)
    return response.data.result;
  }
});