import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class SaveAiFeedbackDto {
  @IsString()
  @IsNotEmpty()
  explanation: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  pointsDeducted: number;
}

export class SaveAiFeedbackListDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveAiFeedbackDto)
  errors: SaveAiFeedbackDto[];
}
