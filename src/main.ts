import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('☀️ Helius MTF API')
    .setDescription("API endpoints for 'Mint the Flag' challenge")
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(process.env.PORT || 3005);
}

bootstrap();

// TODO:
// 2. refactor a faulty `getProgramAccounts` to `heliusApi.getMintlist('collectionAddress')` (fix the existing app and add new features)
// 3. get all nfts from the collection called "CLUE #0000", one of the clues is the correct one (offchain attributes) /v0/tokens/metadata
// 3.1. attribute authorizationMessage should match the Clue.collectionNft.attributes.message & clue.collectionNft.secretKey signer
// 3.2. each clue has an attribute fishyWallet which the hacker should subscribe to via webhooks
// 4. edit the webhook in such a way that it listens to the correct wallet address from above
// 4.1. on that wallet we can see a lot of NFT/token transfers which hint how to whitelist yourself to the CM
// 5. send some Sol to the wallet from above to allowlist yourself to mint (figure out the CM address?)
// 6. sign a message to obtain the Candy Machine address?
// 7. mint the Flag NFT from the CM
// 8. add priority fees to some transaction
