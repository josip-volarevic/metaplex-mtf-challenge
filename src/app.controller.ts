import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MintOneParams } from './dto/mint-one-params.dto';
import { CandyMachineService } from './services/candy-machine.service';
import { HeliusService } from './services/helius.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('🚩 MTF')
@Controller('')
export class AppController {
  constructor(
    private readonly candyMachineService: CandyMachineService,
    private readonly heliusService: HeliusService,
  ) {}

  /* 🐾 Endpoint for minting NFTs from candy machines */
  @Get('mint-one')
  async mintOne(@Query() query: MintOneParams) {
    return await this.candyMachineService.mintOne(
      query.candyMachineAddress,
      query.collectionUpdateAuthorityAddress,
    );
  }

  @Get('webhooks/create')
  async createWebhook() {
    return await this.heliusService.createWebhook();
  }

  @Get('webhooks/get')
  async getMyWebhook() {
    return await this.heliusService.getMyWebhook();
  }

  @Post('webhooks/receive')
  async receiveUpdates(@Body() body) {
    try {
      body[0].instructions.forEach((i) => {
        console.log(i);
      });
    } catch (e) {
      console.log(e);
    }
  }
}
