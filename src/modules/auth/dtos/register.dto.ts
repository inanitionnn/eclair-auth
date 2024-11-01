import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    maxLength: 255,
  })
  @MaxLength(255)
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    required: false,
    maxLength: 255,
  })
  @MaxLength(255)
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'jothdoe@gmail.com',
    maxLength: 255,
  })
  @MaxLength(255)
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'JohnDoe123',
    maxLength: 255,
  })
  @MaxLength(255)
  @IsString()
  password: string;
}
