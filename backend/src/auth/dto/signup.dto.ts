import { IsEmail,  IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;


  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}