import { Injectable, HttpException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { usersTable } from '../../db/schema';
import { UserResponse } from './responses';
import {
  transformToArrayHelper,
  transformToObjectHelper,
} from '../../shared/helpers';
import { CreateUserDto, UserEntity } from './dtos';
import { PaginationDto } from '../../shared/dtos';
import { desc, eq } from 'drizzle-orm';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly redisService: RedisService,
  ) {}

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.databaseService.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .execute();
    return user.length ? user[0] : null;
  }

  public async create(data: CreateUserDto): Promise<UserResponse> {
    const user = await this.databaseService.db
      .insert(usersTable)
      .values(data)
      .returning()
      .execute();
    if (!user || !user.length) {
      throw new HttpException('Somthing went wrong', 500);
    }
    return transformToObjectHelper(user[0], UserResponse);
  }

  // #region Get
  public async findPaginated(
    pagination: PaginationDto,
  ): Promise<UserResponse[]> {
    const { page = 0, size = 20 } = pagination;
    return this.redisService.getOrSet(
      `findPaginated:${page}:${size}`,
      async () => {
        const users = await this.databaseService.db
          .select()
          .from(usersTable)
          .limit(size)
          .offset(page * size)
          .orderBy(desc(usersTable.email))
          .execute();

        return transformToArrayHelper(users, UserResponse);
      },
    );
  }

  public async findAll(): Promise<UserResponse[]> {
    return this.redisService.getOrSet(`findAll`, async () => {
      const users = await this.databaseService.db
        .select()
        .from(usersTable)
        .orderBy(desc(usersTable.email))
        .execute();
      return transformToArrayHelper(users, UserResponse);
    });
  }

  public async findById(id: string): Promise<UserResponse | null> {
    return this.redisService.getOrSet(`findById:${id}`, async () => {
      const user = await this.databaseService.db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .execute();
      console.log(user);
      if (!user.length) {
        return null;
      }
      return transformToObjectHelper(user[0], UserResponse);
    });
  }
  // #endregion Get
}
