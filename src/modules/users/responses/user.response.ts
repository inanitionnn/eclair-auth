import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponse {
  @Expose()
  @ApiProperty({
    description: 'Id of the user',
    example: '961a4c7d-ece4-41a4-b832-b83317e51045',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  firstName: string;

  @Expose()
  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    nullable: true,
  })
  lastName: string;

  @Expose()
  @ApiProperty({
    description: 'Email of the user',
    example: 'jothdoe@gmail.com',
  })
  email: string;
}
