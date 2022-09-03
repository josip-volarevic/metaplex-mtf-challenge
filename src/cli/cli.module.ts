import { Module } from '@nestjs/common';
import { AirdropSolCommand } from './airdrop-sol-command';
import { GenerateEnvironmentCommand } from './generate-environment-command';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentQuestions } from './environment-questions';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    GenerateEnvironmentCommand,
    AirdropSolCommand,
    EnvironmentQuestions,
  ],
})
export class CLIModule {}
