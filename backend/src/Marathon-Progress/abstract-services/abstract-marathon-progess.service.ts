import {
  MarathonProgressData,
  MarathonProgressWithTime,
  UpdateMarathonProgress,
} from 'src/Marathon-Progress/types/marathon-progress.type';

export abstract class AbstractMarathonProgressService {
  abstract startOrResumeMarathon(
    userId: string,
    marathonId: string,
  ): Promise<MarathonProgressWithTime>;

  abstract saveProgress(
    userId: string,
    marathonId: string,
    data: UpdateMarathonProgress,
  ): Promise<MarathonProgressWithTime>;

  abstract getProgress(
    userId: string,
    marathonId: string,
  ): Promise<MarathonProgressWithTime | null>;

  abstract completeMarathon(
    userId: string,
    marathonId: string,
  ): Promise<MarathonProgressData>;

  abstract calculateTimeRemaining(
    progress: MarathonProgressData,
    marathon: any,
  ): MarathonProgressWithTime;
}

export const MARATHON_PROGRESS_SERVICE_TOKEN = Symbol(
  'MARATHON_PROGRESS_SERVICE_TOKEN',
);
