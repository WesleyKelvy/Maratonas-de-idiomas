import { Inject, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsProfessorGuard } from 'src/auth/guards/ws-professor.guard';
import { WsAuthService } from 'src/auth/ws-auth.service';
import {
  AbstractReportService,
  REPORT_SERVICE_TOKEN,
} from 'src/Report/abstract-services/abstract-report.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || '*', // Only for developing
  },
  namespace: '/reports',
})
@UseGuards(WsProfessorGuard)
export class ReportGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clientRooms = new Map<string, string>(); // socketId -> marathonId

  constructor(
    private readonly wsAuthService: WsAuthService,
    @Inject(REPORT_SERVICE_TOKEN)
    private readonly reportService: AbstractReportService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const user = this.wsAuthService.authenticateSocket(client);
      client.data.user = user;
    } catch (error) {
      console.error(
        `[Marathon Session] Authentication failed: ${error.message}`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const marathonId = this.clientRooms.get(client.id);
    console.log(
      `[WebSocket] Client disconnected: ${client.id} from marathon: ${marathonId}`,
    );
    this.clientRooms.delete(client.id);
  }

  // @SubscribeMessage('subscribe-marathon')
  // handleSubscribeMarathonReport(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() data: { marathonId: string },
  // ) {
  //   const { marathonId } = data;
  //   client.join(`marathon-${marathonId}`);
  //   this.clientRooms.set(client.id, marathonId);

  //   console.log(
  //     `[WebSocket] Client ${client.id} subscribed to marathon ${marathonId}`,
  //   );

  //   return {
  //     event: 'subscribed',
  //     data: { marathonId, message: 'Inscrito com sucesso no marathon' },
  //   };
  // }

  @SubscribeMessage('generate-report')
  async handleGenerateReport(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { marathonId: string },
  ) {
    const { marathonId } = data;

    client.join(`marathon-${marathonId}`);
    this.clientRooms.set(client.id, marathonId);

    console.log(
      `[WebSocket] Client ${client.id} subscribed to marathon ${marathonId}`,
    );

    console.log(
      `[WebSocket] Starting report generation for marathon ${marathonId}`,
    );

    // Notify the generation has started
    this.server.to(`marathon-${marathonId}`).emit('report-status', {
      status: 'generating',
      marathonId,
      message: 'Relatório está sendo gerado!',
      timestamp: new Date().toISOString(),
    });

    // Assynchorouns process
    this.reportService
      .createReport(marathonId)
      .then((report) => {
        console.log(`[WebSocket] Report completed for marathon ${marathonId}`);

        // Send report
        this.server.to(`marathon-${marathonId}`).emit('report-ready', {
          status: 'completed',
          report,
        });
      })
      .catch((error) => {
        console.error(
          `[WebSocket] Report generation failed for marathon ${marathonId}:`,
          error,
        );

        // Send error
        this.server.to(`marathon-${marathonId}`).emit('report-error', {
          status: 'error',
          marathonId,
          message: error.message || 'Erro ao gerar relatório',
          timestamp: new Date().toISOString(),
        });
      });

    return {
      event: 'report-generation-started',
      data: {
        marathonId,
        message: 'Geração em andamento. Aguarde!',
      },
    };
  }

  // Public method to emit progress (used in service)
  emitReportProgress(marathonId: string, progress: number, message?: string) {
    this.server.to(`marathon-${marathonId}`).emit('report-progress', {
      marathonId,
      progress,
      message: message || `Processando... ${progress}%`,
      timestamp: new Date().toISOString(),
    });
  }
}
