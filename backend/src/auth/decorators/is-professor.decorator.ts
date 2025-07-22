import { SetMetadata } from '@nestjs/common';

export const IS_PROFESSOR = 'isProfessor';
export const IsFree = () => SetMetadata(IS_PROFESSOR, true);
