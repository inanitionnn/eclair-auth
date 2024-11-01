import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: 'The page number to return',
    example: 1,
    required: false,
    minimum: 0,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  public readonly page?: number;

  @ApiProperty({
    description: 'The number of items to return',
    example: 10,
    required: false,
    maximum: 100,
    default: 20,
    minimum: 1,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  public readonly size?: number;
}
