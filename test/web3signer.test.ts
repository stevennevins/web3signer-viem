import { expect, describe, it, beforeAll } from 'vitest';
import { createWalletClient, http, type WalletClient, verifyMessage, verifyTypedData, parseEther } from 'viem';
import { anvil } from 'viem/chains';
import { web3SignerAccount } from '../src';

describe('Web3Signer Integration', () => {
  let client: WalletClient;

  beforeAll(() => {
    client = createWalletClient({
      chain: anvil,
      transport: http(),
      account: web3SignerAccount,
    });
  });

  it('should sign a message using the client', async () => {
    const message = 'Hello Web3Signer';
    const signature = await client.signMessage({
      message,
      account: web3SignerAccount
    });

    const isValid = await verifyMessage({
      address: web3SignerAccount.address,
      message,
      signature
    });

    expect(isValid).toBe(true);
  });

  it('should sign and verify typed data', async () => {
    const domain = {
      name: 'Test App',
      version: '1',
      chainId: 1
    };

    const types = {
      Message: [
        { name: 'text', type: 'string' }
      ]
    };

    const message = {
      text: 'Hello Web3Signer!'
    };

    const signature = await client.signTypedData({
      account: web3SignerAccount,
      domain,
      types,
      primaryType: 'Message',
      message
    });

    const isValid = await verifyTypedData({
      address: web3SignerAccount.address,
      domain,
      types,
      primaryType: 'Message',
      message,
      signature
    });

    expect(isValid).toBe(true);
  });

  it('should send an ether transaction', async () => {
    const request = await client.prepareTransactionRequest({
      account: web3SignerAccount,
      to: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      value: parseEther("0.01"),
      chain: anvil
    });

    const hash = await client.signTransaction(request);

    expect(typeof hash).toBe('string');

  });
});