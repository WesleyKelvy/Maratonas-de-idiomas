import { SetMetadata } from '@nestjs/common';

export const IS_STUDENT = 'IsStudent';
export const IsStudent = () => SetMetadata(IS_STUDENT, true);
