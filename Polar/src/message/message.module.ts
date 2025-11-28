import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { MessageController } from './message.controller';

@Module({
  providers: [MessageGateway],
  controllers: [MessageController],
  exports: [MessageGateway],
})
export class MessageModule {}
