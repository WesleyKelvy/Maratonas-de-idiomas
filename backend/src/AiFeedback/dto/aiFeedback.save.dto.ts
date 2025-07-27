import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class SaveAiFeedbackDto {
  @IsString()
  @IsNotEmpty()
  explanation: string;

  @IsNumber()
  @IsNotEmpty()
  pointsDeducted: number;
}

export class SaveAiFeedbackListDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveAiFeedbackDto)
  errors: SaveAiFeedbackDto[];
}
