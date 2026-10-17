import { IsString, IsNotEmpty, IsOptional, MaxLength, IsEmail, ValidateIf } from 'class-validator';

export class CreateProfileDto {
  @IsString() @IsNotEmpty()
  @MaxLength(100)
  name: string;
  // An empty string clears the email; anything else must look like an email.
  @IsOptional()
  @ValidateIf((o: CreateProfileDto) => o.email !== '')
  @IsEmail()
  @MaxLength(200)
  email?: string;
  @IsOptional()
  @IsString()
  @MaxLength(100)
  role?: string;
}
