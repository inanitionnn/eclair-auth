import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserResponse } from './responses';
import { UserService } from './user.service';
import { UserEntity } from './dtos';
import {
  ApiDataArrayResponse,
  ApiDataObjectResponse,
  ApiIdParam,
  ApiPaginationQuery,
  CurrentUser,
} from '../../shared/decorators';
import { IdParamDto, PaginationDto } from '../../shared/dtos';

@ApiTags('Users')
@ApiExtraModels(UserResponse)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // #region Get
  @ApiOperation({
    summary: 'Get all users',
  })
  @ApiDataArrayResponse(UserResponse)
  @Get('all')
  async findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({
    summary: 'Get all users',
  })
  @ApiPaginationQuery()
  @ApiDataArrayResponse(UserResponse)
  @Get('paginated')
  async findPaginated(@Query() pagination: PaginationDto) {
    return this.userService.findPaginated(pagination);
  }

  @Get('one/:id')
  @ApiOperation({
    summary: 'Get user by id',
  })
  @ApiIdParam()
  @ApiDataObjectResponse(UserResponse)
  async findById(@Param() params: IdParamDto) {
    const user = await this.userService.findById(params.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get('/me')
  @ApiOperation({
    summary: 'Get current user',
  })
  @ApiDataObjectResponse(UserResponse)
  async getCurrentUser(@CurrentUser() currentUser: UserEntity) {
    return this.userService.findById(currentUser.id);
  }
  // #endregion Get
}
