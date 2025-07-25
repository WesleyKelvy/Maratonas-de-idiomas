import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from 'src/Question/dto/question.create.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
