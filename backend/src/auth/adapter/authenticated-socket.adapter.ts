import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class AuthenticatedSocketAdapter extends IoAdapter {
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    // IMPORTANTE: Passa options com cors
    const serverOptions: ServerOptions = {
      ...options,
      cors: {
        origin: process.env.FRONTEND_URL || '*',
        credentials: true,
      },
    };
    const server = super.createIOServer(port, serverOptions);

    // console.log('[WebSocket] Registering authentication middleware');

    return server;
  }
}

// // Middleware que valida JWT ANTES de aceitar conexão
// server.use((socket, next) => {
//   console.log('[WebSocket] Authenticating connection:', socket.id);

//   try {
//     let token: string | undefined;

//     // 1) Try to get token from cookie
//     const cookies = socket.handshake.headers.cookie;
//     console.log('[WebSocket] Cookies:', cookies);
//     if (cookies) {
//       const parsed = cookie.parse(cookies);
//       token = parsed['access_token'];
//     }

//     // 2) Try to get token from handshake auth (socket.io-client: auth: { token })
//     if (!token && socket.headers.auth && socket.headers.auth.token) {
//       token = socket.handshake.auth.token;
//       console.log('[WebSocket] Token from auth:', token);
//     }

//     // 3) Try to get token from Authorization header "Bearer ..."
//     if (!token && socket.headers.authorization) {
//       token = socket.handshake.headers.authorization.replace(
//         /^Bearer\s+/i,
//         '',
//       );
//       console.log('[WebSocket] Token from Authorization header:', token);
//     }

//     // 4) Try to get token from query param ?token=...
//     if (!token && socket.handshake.query && socket.handshake.query.token) {
//       token = socket.handshake.query.token as string;
//       console.log('[WebSocket] Token from query param:', token);
//     }

//     if (!token) {
//       console.log('[WebSocket] No token found in any source');
//       return next(new Error('Missing access token'));
//     }

//     const decoded = verify(token, process.env.JWT_SECRET) as any;
//     console.log('[WebSocket] Token verified successfully:', decoded);

//     // Injeta user no socket para os guards usarem
//     socket.data.user = decoded;

//     next();
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   } catch (error) {
//     console.error('[WebSocket] Authentication error:', error.message);
//     next(new Error('Invalid token'));
//   }
// });

// server.use((socket, next) => {
//   try {
//     const { cookie: cookieHeader, authorization } = socket.handshake
//       .headers as any;
//     const { auth, query } = socket.handshake as any;
//     console.log('authorization', authorization);
//     console.log('cookieHeader: ', cookieHeader);

//     let token: string | undefined;

//     // 1) cookie "access_token"
//     if (cookieHeader) {
//       const parsed = cookie.parse(cookieHeader);
//       token = parsed['access_token'];
//     }

//     // 2) handshake auth (socket.io-client: auth: { token })
//     if (!token && auth && auth.token) token = auth.token;

//     // 3) Authorization header "Bearer ..."
//     if (!token && authorization)
//       token = authorization.replace(/^Bearer\s+/i, '');

//     // 4) query param ?access_token=...
//     if (!token && query && query.access_token) token = query.access_token;

//     console.log('token: ', token);

//     if (!token) return next(new Error('Missing access token'));

//     const decoded = verify(token, process.env.JWT_SECRET) as any;
//     socket.data.user = decoded;
//     next();
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   } catch (err) {
//     next(new Error('Invalid token'));
//   }
// });
