import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class IdParamDto {
  @ApiProperty({
    description: 'Id of the entity',
    example: '961a4c7d-ece4-41a4-b832-b83317e51045',
  })
  @IsUUID('4')
  id: string;
}
