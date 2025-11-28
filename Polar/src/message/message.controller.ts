import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { MessageGateway } from './message.gateway';

export class ForwardMessageDto {
  channel: string;
  from: string;
  text: string;
  meta?: any;
}

@Controller('api/messages')
export class MessageController {
  constructor(private readonly gateway: MessageGateway) {}

  @Post()
  forward(@Body() body: ForwardMessageDto) {
    const { channel, from, text, meta } = body || {};
    if (!channel || !from || !text) {
      throw new BadRequestException('channel, from and text are required');
    }

    const payload = {
      channel,
      from,
      text,
      meta: meta || {},
      timestamp: new Date().toISOString(),
      company: 'Polar.net',
    };

    // Forward to websocket channel (room)
    this.gateway.sendToChannel(channel, payload);

    // Also return success response to HTTP client
    return { ok: true, forwardedTo: channel, payload };
  }
}
