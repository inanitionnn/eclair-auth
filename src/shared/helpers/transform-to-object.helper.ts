import { ClassConstructor } from 'class-transformer';
import { transformToObjectHelper } from './transform-to-array.helper';

export function transformToArrayHelper<T>(
  data: any[],
  type: ClassConstructor<T>,
): T[] {
  return data.map((item: T) => {
    return transformToObjectHelper(item, type);
  });
}
