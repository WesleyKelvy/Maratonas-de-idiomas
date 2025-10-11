import { LanguageMarathon } from '@prisma/client';
import { CreateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.create.dto';
import { UpdateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.update.dto';

export abstract class AbstractLanguageMarathonService {
  abstract create(
    dto: CreateLanguageMarathonDto,
    code: string,
    userId: string,
  ): Promise<LanguageMarathon>;
  abstract findOneById(id: string): Promise<LanguageMarathon>;
  abstract findOneByCode(code: string): Promise<LanguageMarathon>;
  abstract findAllByClassroomId(id: string): Promise<LanguageMarathon[]>;
  abstract findAllByUserId(id: string): Promise<LanguageMarathon[]>;
  abstract update(
    code: string,
    updateStatsDto: UpdateLanguageMarathonDto,
    userId: string,
  ): Promise<LanguageMarathon>;
  abstract remove(id: string, userId: string): Promise<void>;
}

export const LANGUAGE_MARATHON_SERVICE_TOKEN =
  'LANGUAGE_MARATHON_SERVICE_TOKEN';
