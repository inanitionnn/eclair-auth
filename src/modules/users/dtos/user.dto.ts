import { ApiProperty, PartialType, OmitType, PickType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UserEntity {
  @ApiProperty({
    description: 'Id of the user',
    example: '961a4c7d-ece4-41a4-b832-b83317e51045',
  })
  @IsString()
  id: string;

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
    example: '$2a$12$NqL.oLoEw6gReI4CmHJgoeb60vdKQhm2JapcRtY/MC9u6r5pKl5Wq',
    maxLength: 72,
  })
  @MaxLength(72)
  @IsString()
  password: string;
}

export class UserDto extends OmitType(UserEntity, ['id']) {}
export class CreateUserDto extends UserDto {}
export class UpdateUserDto extends PartialType(
  OmitType(UserDto, ['password', 'email']),
) {}
export class UpdateUserEmailDto extends PickType(UserDto, ['email']) {}
export class UpdateUserPasswordDto extends PickType(UserDto, ['password']) {}
