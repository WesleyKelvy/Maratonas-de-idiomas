import { SetMetadata } from '@nestjs/common';

export const IS_FREE_KEY = 'isFree';
export const IsFree = () => SetMetadata(IS_FREE_KEY, true);
