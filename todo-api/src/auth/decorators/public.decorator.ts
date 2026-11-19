import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
// Put @Public() on a route that should work without a token (login, register...).
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
