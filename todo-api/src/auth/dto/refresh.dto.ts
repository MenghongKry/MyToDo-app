import { IsNotEmpty, IsString } from 'class-validator';

// Used by both POST /auth/refresh and POST /auth/logout.
export class RefreshDto {
  @IsString() @IsNotEmpty()
  refreshToken: string;
}
