import { PartialType } from '@nestjs/mapped-types';
import { CreateLanguageMarathonDto } from 'src/LanguageMarathon/dto/language-marathon.create.dto';

export class UpdateLanguageMarathonDto extends PartialType(
  CreateLanguageMarathonDto,
) {}
