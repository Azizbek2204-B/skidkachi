import { Module } from '@nestjs/common';
import { StoreSubscribesService } from './store_subscribes.service';
import { StoreSubscribesController } from './store_subscribes.controller';

@Module({
  controllers: [StoreSubscribesController],
  providers: [StoreSubscribesService],
})
export class StoreSubscribesModule {}
