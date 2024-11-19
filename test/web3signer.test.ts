import { expect, describe, it, beforeAll } from 'vitest';
import { createWalletClient, http, type WalletClient, verifyMessage, verifyTypedData, parseEther, serializeTransaction, type TransactionSerializable, parseGwei, formatTransaction } from 'viem';
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
      account: web3SignerAccount.address
    });

    expect(signature).toBeTruthy();
    expect(typeof signature).toBe('string');
    expect(signature.startsWith('0x')).toBe(true);

    const valid = await verifyMessage({
      address: web3SignerAccount.address,
      message,
      signature
    });

    expect(valid).toBe(true);
  });

  it('should sign and verify typed data', async () => {
    const domain = {
      name: 'Test App',
      version: '1',
      chainId: 1,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC' as `0x${string}`
    };

    const types = {
      Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' }
      ],
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' }
      ]
    };

    const message = {
      from: {
        name: 'Alice',
        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
      },
      to: {
        name: 'Bob',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
      },
      contents: 'Hello, Bob!'
    };

    const signature = await client.signTypedData({
      account: web3SignerAccount.address,
      domain,
      types,
      primaryType: 'Mail',
      message
    });

    expect(signature).toBeTruthy();
    expect(typeof signature).toBe('string');
    expect(signature.startsWith('0x')).toBe(true);

    const valid = await verifyTypedData({
      address: web3SignerAccount.address,
      domain,
      types,
      primaryType: 'Mail',
      message,
      signature
    });

    expect(valid).toBe(true);
  });

  it('should send an ether transaction', async () => {
    const request = await client.prepareTransactionRequest({
      account: web3SignerAccount,
      to: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      value: parseEther("0.01"),
      chain: null
    });

    const hash = await client.signTransaction(request);

    // expect(hash).toBeTruthy();
    // expect(typeof hash).toBe('string');
    // expect(hash.startsWith('0x')).toBe(true);
    expect(hash).toHaveLength(66);
  });
});