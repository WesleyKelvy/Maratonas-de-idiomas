import {
  CreateMarathonProgress,
  MarathonProgressData,
  UpdateMarathonProgress,
} from 'src/Marathon-Progress/types/marathon-progress.type';

export abstract class AbstractMarathonProgressRepository {
  abstract create(data: CreateMarathonProgress): Promise<MarathonProgressData>;
  abstract findByUserAndMarathon(
    userId: string,
    marathonId: string,
  ): Promise<MarathonProgressData | null>;
  abstract update(
    id: string,
    data: UpdateMarathonProgress,
  ): Promise<MarathonProgressData>;
  abstract delete(id: string): Promise<void>;
}

export const MARATHON_PROGRESS_REPOSITORY_TOKEN = Symbol(
  'MARATHON_PROGRESS_REPOSITORY_TOKEN',
);
