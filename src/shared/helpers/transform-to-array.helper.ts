import {
  ClassConstructor,
  ClassTransformOptions,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';

export function transformToObjectHelper<T>(
  item: unknown,
  type: ClassConstructor<T>,
  options: ClassTransformOptions = {
    strategy: 'excludeAll',
  },
): T {
  const objectTransformed = plainToInstance(type, item, {
    strategy: 'exposeAll',
  });
  return instanceToPlain<T>(objectTransformed, options) as T;
}
