import { SetMetadata } from '@nestjs/common';

export const IS_PROFESSOR = 'isProfessor';
export const IsProfessor = () => SetMetadata(IS_PROFESSOR, true);
