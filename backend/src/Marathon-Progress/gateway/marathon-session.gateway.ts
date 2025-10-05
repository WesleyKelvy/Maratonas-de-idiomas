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
import { WsStudentGuard } from 'src/auth/guards/ws-student.guard';
import { WsAuthService } from 'src/auth/ws-auth.service';
import {
  AbstractLanguageMarathonService,
  LANGUAGE_MARATHON_SERVICE_TOKEN,
} from 'src/LanguageMarathon/abstract-services/abstract-language-marathon.service';
import {
  AbstractMarathonProgressService,
  MARATHON_PROGRESS_SERVICE_TOKEN,
} from 'src/Marathon-Progress/abstract-services/abstract-marathon-progess.service';
import { ChangeQuestionDto } from 'src/Marathon-Progress/dto/change-question.dto';
import { MarathonIdDto } from 'src/Marathon-Progress/dto/marathon-action.dto';
import { SaveDraftAnswerDto } from 'src/Marathon-Progress/dto/save-draft-answer.dto';
import { TimerData } from 'src/Marathon-Progress/types/timerData';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/marathon-session',
})
@UseGuards(WsStudentGuard)
export class MarathonSessionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private clientTimers = new Map<string, TimerData>();

  constructor(
    private readonly wsAuthService: WsAuthService,
    @Inject(MARATHON_PROGRESS_SERVICE_TOKEN)
    private readonly progressService: AbstractMarathonProgressService,
    @Inject(LANGUAGE_MARATHON_SERVICE_TOKEN)
    private readonly marathonService: AbstractLanguageMarathonService,
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
    console.log(`[Marathon Session] Client disconnected: ${client.id}`);
    const timerData = this.clientTimers.get(client.id);
    if (timerData) {
      clearInterval(timerData.interval);
      this.clientTimers.delete(client.id);
    }
  }

  @SubscribeMessage('start-marathon')
  async handleStartOrResumeMarathon(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ) {
    try {
      const marathonId = data.trim().trimStart();

      const user = client.data.user;
      const userId = user.id;

      // Start or resume the progress with calculated time
      const progress = await this.progressService.startOrResumeMarathon(
        userId,
        marathonId,
      );

      // Entra na sala do marathon
      client.join(`marathon-${marathonId}-${userId}`);

      // Start sending time updates per second
      await this.startTimeUpdates(client, userId, marathonId);

      return {
        event: 'marathon-started',
        data: progress,
      };
    } catch (error) {
      console.error('[start-marathon] Error:', error.message);
      return {
        event: 'error',
        data: { message: error.message },
      };
    }
  }

  @SubscribeMessage('save-answer')
  async handleSaveDraftAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SaveDraftAnswerDto,
  ) {
    const userId = client.data.user.id;
    const maxRetries = 5;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const progress = await this.progressService.saveProgress(
          userId,
          data.marathonId,
          { draft_answer: data.draftAnswer },
        );

        client.emit('answer-saved', {
          questionId: data.questionId,
          saved: true,
          progress,
        });

        return { event: 'draft-answer-saved', data: { success: true } };
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          console.error('[save-answer] Max retries reached:', error.message);

          return { event: 'error', data: { message: error.message } };
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  @SubscribeMessage('change-question')
  async handleChangeQuestion(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: ChangeQuestionDto,
  ) {
    try {
      const userId = client.data.user.id;

      const { marathonId, questionId } = data;

      const progress = await this.progressService.saveProgress(
        userId,
        marathonId,
        { current_question_id: questionId },
      );

      return {
        event: 'question-changed',
        data: progress,
      };
    } catch (error) {
      console.error('[change-question] Error:', error.message);

      return {
        event: 'error',
        data: { message: error.message },
      };
    }
  }

  @SubscribeMessage('complete-marathon')
  async handleCompleteMarathon(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MarathonIdDto,
  ) {
    try {
      const userId = client.data.user.id;

      // Stop the timer
      const timerData = this.clientTimers.get(client.id);
      if (timerData) {
        clearInterval(timerData.interval);
        this.clientTimers.delete(client.id);
      }

      const progress = await this.progressService.completeMarathon(
        userId,
        data.marathonId,
      );

      client.emit('marathon-completed', {
        progress,
        message: 'Marathon completed!',
      });

      return {
        event: 'marathon-completed',
        data: progress,
      };
    } catch (error) {
      return {
        event: 'error',
        data: { message: error.message },
      };
    }
  }

  // Send real time updates
  private async startTimeUpdates(
    client: Socket,
    userId: string,
    marathonId: string,
  ) {
    const existingTimer = this.clientTimers.get(client.id);
    if (existingTimer) {
      clearInterval(existingTimer.interval);
    }

    const progress = await this.progressService.getProgress(userId, marathonId);
    if (!progress) return;

    const marathon = await this.marathonService.findOneById(marathonId);
    const endDate = new Date(marathon.end_date);
    const startedAt = new Date(progress.started_at);

    // Send update per second
    const interval = setInterval(() => {
      try {
        const now = new Date();

        const timeToDeadlineMs = endDate.getTime() - now.getTime();
        const timeRemaining = Math.max(0, Math.floor(timeToDeadlineMs / 1000));

        const timeElapsedMs = now.getTime() - startedAt.getTime();
        const timeElapsed = Math.floor(timeElapsedMs / 1000);

        client.emit('time-update', {
          time_remaining: timeRemaining,
          time_elapsed: timeElapsed,
        });

        if (timeRemaining <= 0) {
          clearInterval(interval);
          this.clientTimers.delete(client.id);

          this.progressService
            .completeMarathon(userId, marathonId)
            .then(() => {
              client.emit('time-up', {
                message: 'Time is up! Marathon completed.',
              });
            })
            .catch((error) => {
              console.error('[time-up] Error completing marathon:', error);
            });
        }
      } catch (error) {
        console.error('[startTimeUpdates] Interval error:', error);
        clearInterval(interval);
        this.clientTimers.delete(client.id);
      }
    }, 1000);

    this.clientTimers.set(client.id, { interval, endDate, startedAt });
  }
}
