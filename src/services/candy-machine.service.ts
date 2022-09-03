import { Injectable } from '@nestjs/common';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { keypairIdentity, Metaplex } from '@metaplex-foundation/js';
import * as AES from 'crypto-js/aes';
import * as Utf8 from 'crypto-js/enc-utf8';
import * as bs58 from 'bs58';

const MAX_NAME_LENGTH = 32;
const MAX_URI_LENGTH = 200;
const MAX_SYMBOL_LENGTH = 10;
const MAX_CREATOR_LEN = 32 + 1 + 1;
const MAX_CREATOR_LIMIT = 5;
const MAX_DATA_SIZE =
  4 +
  MAX_NAME_LENGTH +
  4 +
  MAX_SYMBOL_LENGTH +
  4 +
  MAX_URI_LENGTH +
  2 +
  1 +
  4 +
  MAX_CREATOR_LIMIT * MAX_CREATOR_LEN;
const MAX_METADATA_LEN = 1 + 32 + 32 + MAX_DATA_SIZE + 1 + 1 + 9 + 172;
const CREATOR_ARRAY_START =
  1 +
  32 +
  32 +
  4 +
  MAX_NAME_LENGTH +
  4 +
  MAX_URI_LENGTH +
  4 +
  MAX_SYMBOL_LENGTH +
  2 +
  1 +
  4;

@Injectable()
export class CandyMachineService {
  private readonly connection: Connection;
  private readonly metaplex: Metaplex;

  constructor() {
    this.connection = new Connection(
      process.env.SOLANA_RPC_NODE_ENDPOINT,
      'confirmed',
    );
    this.metaplex = new Metaplex(this.connection);

    const identityWallet = AES.decrypt(
      process.env.IDENTITY_PRIVATE_KEY,
      process.env.IDENTITY_SECRET,
    );

    const identityKeypair = Keypair.fromSecretKey(
      Buffer.from(JSON.parse(identityWallet.toString(Utf8))),
    );

    this.metaplex.use(keypairIdentity(identityKeypair));
  }

  async findMintedNfts(candyMachineAddress: string) {
    try {
      const candyMachinePublicKey = new PublicKey(candyMachineAddress);
      const candyMachineCreator = PublicKey.findProgramAddressSync(
        [Buffer.from('candy_machine'), candyMachinePublicKey.toBuffer()],
        this.metaplex.programs().getCandyMachine().address,
      );

      const mints = await this.getMintAddresses(candyMachineCreator[0]);
      return mints;
    } catch (e) {
      console.log('error', e);
    }
  }

  async getMintAddresses(firstCreatorAddress: PublicKey) {
    const metadataAccounts = await this.connection.getProgramAccounts(
      this.metaplex.programs().getTokenMetadata().address,
      {
        // The mint address is located at byte 33 and lasts for 32 bytes.
        dataSlice: { offset: 33, length: 32 },

        filters: [
          // Only get Metadata accounts.
          { dataSize: MAX_METADATA_LEN },

          // Filter using the first creator.
          {
            memcmp: {
              offset: CREATOR_ARRAY_START,
              bytes: firstCreatorAddress.toBase58(),
            },
          },
        ],
      },
    );

    return metadataAccounts.map((metadataAccountInfo) =>
      bs58.encode(metadataAccountInfo.account.data),
    );
  }

  async mintOne(
    candyMachineAddress: string,
    collectionUpdateAuthorityAddress: string,
  ) {
    const candyMachine = await this.metaplex.candyMachines().findByAddress({
      address: new PublicKey(candyMachineAddress),
    });

    const { nft } = await this.metaplex.candyMachines().mint({
      candyMachine,
      collectionUpdateAuthority: new PublicKey(
        collectionUpdateAuthorityAddress,
      ),
    });

    return nft;
  }
}
