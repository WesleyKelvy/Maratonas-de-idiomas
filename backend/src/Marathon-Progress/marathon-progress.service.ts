import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  AbstractEnrollmentService,
  ENROLLMENT_SERVICE_TOKEN,
} from 'src/Enrollment/abstract-services/abstract-enrollment.service';
import {
  AbstractLanguageMarathonService,
  LANGUAGE_MARATHON_SERVICE_TOKEN,
} from 'src/LanguageMarathon/abstract-services/abstract-language-marathon.service';
import { AbstractMarathonProgressService } from 'src/Marathon-Progress/abstract-services/abstract-marathon-progess.service';
import {
  MarathonProgressData,
  MarathonProgressWithTime,
  UpdateMarathonProgress,
} from 'src/Marathon-Progress/types/marathon-progress.type';
import {
  AbstractMarathonProgressRepository,
  MARATHON_PROGRESS_REPOSITORY_TOKEN,
} from 'src/repositories/abstract/marathon-progress.repository';

@Injectable()
export class MarathonProgressService
  implements AbstractMarathonProgressService
{
  constructor(
    @Inject(MARATHON_PROGRESS_REPOSITORY_TOKEN)
    private readonly marathonProgressRepository: AbstractMarathonProgressRepository,
    @Inject(LANGUAGE_MARATHON_SERVICE_TOKEN)
    private readonly marathonService: AbstractLanguageMarathonService,
    @Inject(ENROLLMENT_SERVICE_TOKEN)
    private readonly enrollmentService: AbstractEnrollmentService,
  ) {}

  async startOrResumeMarathon(
    userId: string,
    marathonId: string,
  ): Promise<MarathonProgressWithTime> {
    const marathon = await this.marathonService.findOneById(marathonId);

    if (!marathon) {
      throw new HttpException('Marathon not found', HttpStatus.NOT_FOUND);
    }

    // Check if the marathon is still open
    const now = new Date();

    if (marathon.end_date && now > marathon.end_date) {
      throw new HttpException('Marathon has ended', HttpStatus.BAD_REQUEST);
    }

    const enrollment = await this.enrollmentService.findOne(marathonId, userId);
    if (!enrollment) {
      throw new HttpException('Not enrolled!', HttpStatus.FORBIDDEN);
    }

    // Verify if there is current progress
    const existingProgress =
      await this.marathonProgressRepository.findByUserAndMarathon(
        userId,
        marathonId,
      );
    console.log('progress: ', existingProgress);

    if (existingProgress) {
      // If it's completed, it can not be resumed
      if (existingProgress.completed) {
        throw new HttpException(
          'Marathon already completed',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Get remaing time
      const progressWithTime = this.calculateTimeRemaining(
        existingProgress,
        marathon.end_date,
      );

      // If time is up, it marks as complete
      if (progressWithTime.is_expired) {
        await this.marathonProgressRepository.update(existingProgress.id, {
          completed: true,
        });
        throw new HttpException(
          'Time limit exceeded. Marathon auto-completed.',
          HttpStatus.BAD_REQUEST,
        );
      }

      return progressWithTime;
    }

    // Cria novo progresso
    const newProgress = await this.marathonProgressRepository.create({
      user_id: userId,
      marathon_id: marathonId,
    });

    return this.calculateTimeRemaining(newProgress, marathon.end_date);
  }

  async saveProgress(
    userId: string,
    marathonId: string,
    data: UpdateMarathonProgress,
  ): Promise<MarathonProgressWithTime> {
    const enrollment = await this.enrollmentService.findOne(marathonId, userId);

    if (!enrollment) {
      throw new HttpException('Not enrolled', HttpStatus.FORBIDDEN);
    }

    const marathon = await this.marathonService.findOneById(marathonId);

    if (marathon.start_date > new Date()) {
      throw new HttpException(
        'Marathon not started yet',
        HttpStatus.BAD_REQUEST,
      );
    }

    const progress =
      await this.marathonProgressRepository.findByUserAndMarathon(
        userId,
        marathonId,
      );

    if (!progress) {
      throw new HttpException(
        'Marathon progress not found',
        HttpStatus.NOT_FOUND,
      );
    }

    if (progress.completed) {
      throw new HttpException(
        'Cannot update completed marathon',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verify if there is remaining time
    const progressWithTime = this.calculateTimeRemaining(
      progress,
      marathon.end_date,
    );

    if (progressWithTime.is_expired) {
      await this.marathonProgressRepository.update(progress.id, {
        completed: true,
      });
      throw new HttpException('Time limit exceeded', HttpStatus.BAD_REQUEST);
    }

    const updated = await this.marathonProgressRepository.update(
      progress.id,
      data,
    );
    return this.calculateTimeRemaining(updated, marathon.end_date);
  }

  async getProgress(
    userId: string,
    marathonId: string,
  ): Promise<MarathonProgressWithTime | null> {
    const progress =
      await this.marathonProgressRepository.findByUserAndMarathon(
        userId,
        marathonId,
      );

    if (!progress) {
      return null;
    }

    const marathon = await this.marathonService.findOneById(marathonId);
    return this.calculateTimeRemaining(progress, marathon.end_date);
  }

  async completeMarathon(
    userId: string,
    marathonId: string,
  ): Promise<MarathonProgressData> {
    const progress =
      await this.marathonProgressRepository.findByUserAndMarathon(
        userId,
        marathonId,
      );

    if (!progress) {
      throw new HttpException(
        'Marathon progress not found',
        HttpStatus.NOT_FOUND,
      );
    }

    if (progress.completed) {
      return progress;
    }

    return await this.marathonProgressRepository.update(progress.id, {
      completed: true,
    });
  }

  calculateTimeRemaining(
    progress: MarathonProgressData,
    endDate: Date,
  ): MarathonProgressWithTime {
    const now = new Date();
    const deadline = new Date(endDate);
    const startedAt = new Date(progress.started_at);

    // Deadline timer
    const timeToDeadlineMs = deadline.getTime() - now.getTime();
    const timeRemaining = Math.max(0, Math.floor(timeToDeadlineMs / 1000));

    // Time since student started
    const timeElapsedMs = now.getTime() - startedAt.getTime();
    const timeElapsed = Math.floor(timeElapsedMs / 1000);

    return {
      ...progress,
      time_remaining: timeRemaining,
      time_elapsed: timeElapsed,
      is_expired: timeRemaining <= 0,
    };
  }
}
