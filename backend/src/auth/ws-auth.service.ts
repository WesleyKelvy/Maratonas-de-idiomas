import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import * as cookie from 'cookie';
import { verify } from 'jsonwebtoken';

@Injectable()
export class WsAuthService {
  authenticateSocket(client: Socket): any {
    const cookies = client.handshake.headers.cookie;
    if (!cookies) {
      throw new Error('No authentication cookie');
    }

    const parsed = cookie.parse(cookies);
    const token = parsed['access_token'];
    if (!token) {
      throw new Error('Missing access token');
    }

    // Ensure JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured on the server');
    }

    return verify(token, process.env.JWT_SECRET);
  }
}
