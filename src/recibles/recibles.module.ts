import { Module } from '@nestjs/common';
import { ReciblesService } from './recibles.service';
import { ReciblesController } from './recibles.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ReciblesController],
  providers: [ReciblesService],
  imports: [HttpModule],
})
export class ReciblesModule {}
