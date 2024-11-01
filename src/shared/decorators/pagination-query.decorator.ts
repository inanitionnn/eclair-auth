import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiPaginationQuery() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Number of page. Can be empty. Default is 1.',
    }),
    ApiQuery({
      name: 'size',
      required: false,
      type: Number,
      description:
        'Max number of entities to return. Can be empty. Default is 20.',
    }),
  );
}
