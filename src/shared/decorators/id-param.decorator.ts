import { applyDecorators } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';

export function ApiIdParam() {
  return applyDecorators(
    ApiParam({
      name: 'id',
      required: true,
      type: String,
      description: 'Id of the entity.',
    }),
  );
}
