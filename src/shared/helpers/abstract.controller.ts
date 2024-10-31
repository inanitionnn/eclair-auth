import { ConfigService } from '@nestjs/config';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import {
  ClassConstructor,
  ClassTransformOptions,
} from 'class-transformer/types/interfaces';

export abstract class AbstractController {
  protected constructor(protected readonly configService: ConfigService) {}

  public transformToArray<T, R>(
    data: T[],
    type: ClassConstructor<R>,
  ): Record<string, any>[] {
    return data.map((item: T) => {
      return this.transformToObject(item, type);
    });
  }

  public transformToObject<T, R>(
    item: T,
    type: ClassConstructor<R>,
    options: ClassTransformOptions = {
      strategy: 'excludeAll',
    },
  ): Record<string, any> {
    const objectTransformed = plainToInstance(type, item, {
      strategy: 'exposeAll',
    });
    return instanceToPlain(objectTransformed, options);
  }
}
