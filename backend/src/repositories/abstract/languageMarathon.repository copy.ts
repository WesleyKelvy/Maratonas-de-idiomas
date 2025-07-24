import { LanguageMarathon } from '@prisma/client';
import { CreateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.create.dto';
import { UpdateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.update.dto';

export abstract class AbstractLanguageMarathonRepository {
  abstract create(
    dto: CreateLanguageMarathonDto,
    code: string,
  ): Promise<LanguageMarathon>;
  abstract findOne(id: string): Promise<LanguageMarathon | null>;
  abstract findAllByClassroomCode(code: string): Promise<LanguageMarathon[]>;
  abstract update(
    code: string,
    dto: UpdateLanguageMarathonDto,
  ): Promise<LanguageMarathon>;
  abstract remove(id: string): Promise<void>;
}

export const LANGUAGE_MARATHON_REPOSITORY_TOKEN =
  'LANGUAGE_MARATHON_REPOSITORY_TOKEN';
