import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CandyMachineService } from './services/candy-machine.service';
import { HeliusService } from './services/helius.service';
import { MetaplexService } from './services/metaplex.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [MetaplexService, CandyMachineService, HeliusService],
})
export class AppModule {}
