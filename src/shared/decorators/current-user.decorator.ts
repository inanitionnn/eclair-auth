import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../modules/users/dtos/user.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserEntity => {
    const request = context.switchToHttp().getRequest();

    return request.user;
  },
);
