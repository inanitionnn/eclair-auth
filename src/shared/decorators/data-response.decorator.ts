import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiDataObjectResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      description: model.toString(),
      schema: {
        $ref: getSchemaPath(model),
      },
    }),
  );
};

export const ApiDataArrayResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      description: model.toString() + ' array',
      type: [model],
    }),
  );
};

export const ApiDataOneOfObjectResponse = <
  TModel1 extends Type<any>,
  TModel2 extends Type<any>,
>(
  model1: TModel1,
  model2: TModel2,
  description: string,
) => {
  return applyDecorators(
    ApiOkResponse({
      description: description,
      schema: {
        oneOf: [
          {
            properties: {
              data: {
                $ref: getSchemaPath(model1),
              },
            },
          },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model2),
              },
            },
          },
        ],
      },
    }),
  );
};
