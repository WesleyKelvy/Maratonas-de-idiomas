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
import { Role } from '@prisma/client';
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

  // Rastrear quais maratonas estão sendo processadas
  private processingMarathons = new Set<string>();

  constructor(
    private readonly wsAuthService: WsAuthService,
    @Inject(REPORT_SERVICE_TOKEN)
    private readonly reportService: AbstractReportService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const user = this.wsAuthService.authenticateSocket(client);
      if (user.role !== Role.Professor) {
        console.log(
          `[WebSocket] Non-professor user attempted connection: ${user.email}`,
        );
        client.disconnect();
        return;
      }
      client.data.user = user;
      console.log(
        `[WebSocket] Professor connected: ${user.email} (${client.id})`,
      );
    } catch (error) {
      console.error(`[WebSocket] Authentication failed: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const marathonId = this.clientRooms.get(client.id);
    if (marathonId) {
      console.log(
        `[WebSocket] Client disconnected: ${client.id} from marathon: ${marathonId}`,
      );

      // Verificar se ainda há outros clientes na sala
      const roomClients = this.server.sockets.adapter.rooms.get(
        `marathon-${marathonId}`,
      );
      if (!roomClients || roomClients.size === 0) {
        console.log(
          `[WebSocket] No more clients in marathon ${marathonId} room`,
        );
        // Opcional: cancelar geração se não houver mais clientes
      }
    }
    this.clientRooms.delete(client.id);
  }

  @SubscribeMessage('generate-report')
  async handleGenerateReport(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { marathonId: string },
  ) {
    const { marathonId } = data;

    if (!marathonId) {
      return {
        event: 'report-error',
        data: {
          message: 'Marathon ID is required',
        },
      };
    }

    // Adicionar cliente à sala
    client.join(`marathon-${marathonId}`);
    this.clientRooms.set(client.id, marathonId);

    console.log(
      `[WebSocket] Client ${client.id} subscribed to marathon ${marathonId}`,
    );

    // Verificar se já está sendo processado
    if (this.processingMarathons.has(marathonId)) {
      console.log(
        `[WebSocket] Report generation already in progress for marathon ${marathonId}`,
      );

      // Notificar o cliente que a geração já está em andamento
      this.server.to(`marathon-${marathonId}`).emit('report-status', {
        status: 'generating',
        marathonId,
        message: 'Geração já em andamento. Você receberá atualizações.',
        timestamp: new Date().toISOString(),
      });

      return {
        event: 'report-generation-started',
        data: {
          marathonId,
          message: 'Geração já em andamento. Aguarde!',
        },
      };
    }

    // Marcar como em processamento
    this.processingMarathons.add(marathonId);

    console.log(
      `[WebSocket] Starting report generation for marathon ${marathonId}`,
    );

    // Notificar que a geração começou
    this.server.to(`marathon-${marathonId}`).emit('report-status', {
      status: 'generating',
      marathonId,
      message: 'Relatório está sendo gerado!',
      timestamp: new Date().toISOString(),
    });

    // Processo assíncrono
    this.reportService
      .createReport(marathonId)
      .then((report) => {
        console.log(`[WebSocket] Report completed for marathon ${marathonId}`);

        // Enviar relatório completo
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

        // Enviar erro
        this.server.to(`marathon-${marathonId}`).emit('report-error', {
          status: 'error',
          marathonId,
          message: error.message || 'Erro ao gerar relatório',
          timestamp: new Date().toISOString(),
        });
      })
      .finally(() => {
        // Remover do conjunto de processamento
        this.processingMarathons.delete(marathonId);
        console.log(
          `[WebSocket] Removed marathon ${marathonId} from processing queue`,
        );
      });

    return {
      event: 'report-generation-started',
      data: {
        marathonId,
        message: 'Geração iniciada. Aguarde as atualizações!',
      },
    };
  }

  // Método público para emitir progresso
  emitReportProgress(marathonId: string, progress: number, message?: string) {
    this.server.to(`marathon-${marathonId}`).emit('report-progress', {
      marathonId,
      progress,
      message: message || `Processando... ${progress}%`,
      timestamp: new Date().toISOString(),
    });
  }
}
