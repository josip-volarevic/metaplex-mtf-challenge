import { Injectable } from '@nestjs/common';
import { Connection } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

@Injectable()
export class MetaplexService {
  private readonly connection: Connection;

  constructor() {
    this.connection = new Connection(
      process.env.SOLANA_RPC_NODE_ENDPOINT,
      'confirmed',
    );
  }

  async getMintlist(collectionNftAddress: string) {
    const parsedAccounts = await this.connection.getParsedProgramAccounts(
      TOKEN_PROGRAM_ID,
      {
        filters: [
          { dataSize: 165 },
          // This offset is for wallet address, not for the collection NFT
          { memcmp: { offset: 32, bytes: collectionNftAddress } },
          // Filter for NFTs: Base58 for [1,0,0,0,0,0,0,0]
          { memcmp: { bytes: 'Ahg1opVcGX', offset: 64 } },
        ],
      },
    );

    return parsedAccounts;
  }
}
