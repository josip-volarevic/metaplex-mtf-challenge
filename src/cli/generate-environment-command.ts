import { Cluster, clusterApiUrl, Connection } from '@solana/web3.js';
import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { Metaplex, sol } from '@metaplex-foundation/js';
import { createWallet } from '../utils/wallets';

interface GenerateEnvironmentCommandOptions {
  cluster?: Cluster;
  heliusApiKey: string;
}

function clusterHeliusApiUrl(cluster: Cluster, apiKey: string) {
  switch (cluster) {
    case 'devnet':
      return `https://rpc-devnet.helius.xyz/?api-key=${apiKey}`;
    case 'mainnet-beta':
      return `https://rpc.helius.xyz/?api-key=${apiKey}`;
    default:
      return '';
  }
}

@Command({
  name: 'generate-env',
  description: 'Generate necessary environment variables and wallets',
})
export class GenerateEnvironmentCommand extends CommandRunner {
  constructor(private readonly inquirerService: InquirerService) {
    super();
  }

  async run(
    inputs: string[],
    options: GenerateEnvironmentCommandOptions,
  ): Promise<void> {
    options = await this.inquirerService.ask('environment', options);
    this.generateEnvironment(options.cluster, options.heliusApiKey);
  }

  generateEnvironment = async (cluster: Cluster, heliusApiKey: string) => {
    console.log('\n\nGenerating new .env values...');

    const endpoint = clusterApiUrl(cluster);
    const heliusEndpoint = clusterHeliusApiUrl(cluster, heliusApiKey);
    const connection = new Connection(endpoint, 'confirmed');
    const metaplex = new Metaplex(connection);
    const identityWallet = createWallet();

    if (cluster !== 'mainnet-beta') {
      console.log('Airdropping 1 Sol to the identity wallet...');
      try {
        await metaplex.rpc().airdrop(identityWallet.keypair.publicKey, sol(1));
      } catch (e) {
        console.log('ERROR: Failed to airdrop 1 Sol!', e);
        // TODO: try airdropping manually on: https://solfaucet.com
      }
    }

    console.log('\n');
    console.log('⚠️  Copy this value in a text file or sticky notes!!');
    console.log('---------------------------------------------------');
    // TODO: save this value in an output file
    console.log(
      '\x1b[36m%s\x1b[0m',
      'Identity wallet address:',
      identityWallet.address,
    );
    console.log('\n');

    // TODO: npm i chalk
    console.log('⚠️  Replace .env placeholder values with these below...');
    console.log('------------------------------------------------------');
    console.log(`\x1b[33mHELIUS_API_KEY\x1b[0m="${heliusApiKey}"`);
    console.log(`\x1b[33mSOLANA_CLUSTER\x1b[0m="${cluster}"`);
    console.log(`\x1b[33mSOLANA_RPC_NODE_ENDPOINT\x1b[0m="${heliusEndpoint}"`);
    console.log(`\x1b[33mIDENTITY_SECRET\x1b[0m="${identityWallet.secret}"`);
    console.log(
      `\x1b[33mIDENTITY_PRIVATE_KEY\x1b[0m="${identityWallet.encryptedPrivateKey}"`,
    );
    console.log('\n');

    console.log('💻 \x1b[32mHappy hacking! \n');
    return;
  };
}
