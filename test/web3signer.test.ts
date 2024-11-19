import { expect, describe, it, beforeAll } from 'vitest';
import { createWalletClient, http, type WalletClient, verifyMessage } from 'viem';
import { anvil } from 'viem/chains';
import { web3SignerAccount } from '../src';

describe('Web3Signer Integration', () => {
  let client: WalletClient;

  beforeAll(() => {
    client = createWalletClient({
      chain: anvil,
      transport: http(),
      account: web3SignerAccount
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

})