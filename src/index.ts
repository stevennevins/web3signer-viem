import { toAccount } from 'viem/accounts';
import axios from 'axios';
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
    const response = await axios.post(signerUrl, {
      jsonrpc: '2.0',
      method: 'eth_sign',
      params: [address, message],
      id: 1,
    });
    return response.data.result;
  },
  // Sign a transaction using Web3Signer
  async signTransaction(transaction) {
    const response = await axios.post(signerUrl, {
      jsonrpc: '2.0',
      method: 'eth_signTransaction',
      params: [transaction],
      id: 1,
    });
    // Depending on the response, you might need to serialize the transaction
    return response.data.result;
  },
  // Sign typed data using Web3Signer
  async signTypedData(params) {
    const { domain, types, message, primaryType } = params;
    const response = await axios.post(signerUrl, {
      jsonrpc: '2.0',
      method: 'eth_signTypedData',
      params: [address, { domain, types, message, primaryType }],
      id: 1,
    });
    return response.data.result;
  }
});