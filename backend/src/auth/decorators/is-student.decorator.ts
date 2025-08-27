import { SetMetadata } from '@nestjs/common';

export const IS_STUDENT = 'isStudent';
export const IsStudent = () => SetMetadata(IS_STUDENT, true);
