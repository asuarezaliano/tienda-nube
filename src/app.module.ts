import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { ReciblesModule } from './recibles/recibles.module';

@Module({
  imports: [TransactionModule, ReciblesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
