import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/support', cors: { origin: '*' } })
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('MessageGateway initialized (namespace: /support)');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Client can emit { event: 'join', channel: 'room-name' } to join a room
  @SubscribeMessage('join')
  handleJoin(@MessageBody() data: { channel: string }, @ConnectedSocket() client: Socket) {
    const channel = data?.channel;
    if (!channel) {
      client.emit('error', { message: 'channel required for join' });
      return;
    }
    client.join(channel);
    client.emit('joined', { channel });
    console.log(`Client ${client.id} joined channel ${channel}`);
  }

  // Client can emit 'leave' to leave a channel
  @SubscribeMessage('leave')
  handleLeave(@MessageBody() data: { channel: string }, @ConnectedSocket() client: Socket) {
    const channel = data?.channel;
    if (channel) {
      client.leave(channel);
      client.emit('left', { channel });
      console.log(`Client ${client.id} left channel ${channel}`);
    }
  }

  // Send payload to a specific channel (room)
  sendToChannel(channel: string, payload: any) {
    if (!this.server) {
      console.warn('WebSocket server not initialized yet.');
      return;
    }
    this.server.to(channel).emit('message', payload);
    console.log(`Forwarded message to channel ${channel}:`, payload);
  }
}
