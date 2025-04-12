import { IsString } from 'class-validator';

export class LoginReqDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
