import { LanguageMarathon } from '@prisma/client';
import { CreateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.create.dto';
import { UpdateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.update.dto';
import { CustomLanguageMarathon } from 'src/LanguageMarathon/entities/language-marathon.entity';

export abstract class AbstractLanguageMarathonRepository {
  abstract findAllByClassroom(id: string): Promise<LanguageMarathon[]>;
  abstract findAllByUserId(id: string): Promise<LanguageMarathon[]>;
  abstract findAllIdsAndTitle(
    userId: string,
  ): Promise<CustomLanguageMarathon[]>;
  abstract create(
    dto: CreateLanguageMarathonDto,
    id: string,
    userId: string,
    code: string,
  ): Promise<LanguageMarathon>;
  abstract findOneById(id: string): Promise<LanguageMarathon | null>;
  abstract findOneByIdWithQuestions(
    id: string,
  ): Promise<LanguageMarathon | null>;
  abstract findOneByCode(code: string): Promise<LanguageMarathon | null>;
  abstract update(
    id: string,
    updateMarathonDto: UpdateLanguageMarathonDto,
    userId: string,
  ): Promise<LanguageMarathon>;
  abstract remove(id: string, userId: string): Promise<void>;
}

export const LANGUAGE_MARATHON_REPOSITORY_TOKEN =
  'LANGUAGE_MARATHON_REPOSITORY_TOKEN';
