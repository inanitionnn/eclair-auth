import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DatabaseService } from '../database/database.service';
import { RedisService } from '../redis/redis.service';
import { UserEntity } from './dtos';
import { UserResponse } from './responses';
import { HttpException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let databaseService: DatabaseService;
  let redisService: RedisService;

  const mockUserEntity: UserEntity = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'password',
  };

  const mockUserResponse: UserResponse = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
  };

  const mockDatabaseService = {
    db: {
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    },
  };

  const mockRedisService = {
    getOrSet: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should retrieve a user from the database if not cached', async () => {
      mockDatabaseService.db.execute.mockResolvedValue([mockUserEntity]);

      const result = await userService.findByEmail('test@example.com');

      expect(result).toEqual(mockUserEntity);
      expect(databaseService.db.select).toHaveBeenCalled();
      expect(databaseService.db.execute).toHaveBeenCalled();
    });

    it('should return null if user is not found in the database', async () => {
      mockDatabaseService.db.execute.mockResolvedValue([]);

      const result = await userService.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(databaseService.db.select).toHaveBeenCalled();
      expect(databaseService.db.execute).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a user from Redis if cached', async () => {
      mockRedisService.getOrSet.mockResolvedValue(mockUserResponse);

      const result = await userService.findById('1');

      expect(result).toEqual(mockUserResponse);
      expect(redisService.getOrSet).toHaveBeenCalledWith(
        'findById:1',
        expect.any(Function),
      );
      expect(databaseService.db.select).not.toHaveBeenCalled();
    });

    it('should retrieve a user from the database if not cached', async () => {
      mockRedisService.getOrSet.mockImplementation((key, fetch) => fetch());
      mockDatabaseService.db.execute.mockResolvedValue([mockUserEntity]);

      const result = await userService.findById('1');

      expect(result).toEqual(mockUserResponse);
      expect(redisService.getOrSet).toHaveBeenCalledWith(
        'findById:1',
        expect.any(Function),
      );
      expect(databaseService.db.select).toHaveBeenCalled();
      expect(databaseService.db.execute).toHaveBeenCalled();
    });

    it('should return null if user is not found in the database', async () => {
      mockRedisService.getOrSet.mockImplementation((key, fetch) => fetch());
      mockDatabaseService.db.execute.mockResolvedValue([]);

      const result = await userService.findById('1');

      expect(result).toBeNull();
      expect(redisService.getOrSet).toHaveBeenCalledWith(
        'findById:1',
        expect.any(Function),
      );
      expect(databaseService.db.select).toHaveBeenCalled();
      expect(databaseService.db.execute).toHaveBeenCalled();
    });
  });
  describe('create', () => {
    it('should create a user and return the user response', async () => {
      const mockCreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
      };

      mockDatabaseService.db.insert.mockReturnThis();
      mockDatabaseService.db.returning.mockReturnThis();
      mockDatabaseService.db.execute.mockResolvedValue([mockUserEntity]);

      const result = await userService.create(mockCreateUserDto);

      expect(result).toEqual(mockUserResponse);
      expect(databaseService.db.insert).toHaveBeenCalled();
      expect(databaseService.db.execute).toHaveBeenCalled();
    });

    it('should throw an exception if user creation fails', async () => {
      const mockCreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
      };

      mockDatabaseService.db.insert.mockReturnThis();
      mockDatabaseService.db.returning.mockReturnThis();
      mockDatabaseService.db.execute.mockResolvedValue([]); // Simulate failure

      await expect(userService.create(mockCreateUserDto)).rejects.toThrow(
        HttpException,
      );
      await expect(userService.create(mockCreateUserDto)).rejects.toThrow(
        'Somthing went wrong',
      );
    });
  });

  describe('findPaginated', () => {
    it('should return paginated users from Redis if cached', async () => {
      const paginationDto = { page: 0, size: 20 };
      const mockUsers = [mockUserResponse];

      mockRedisService.getOrSet.mockResolvedValue(mockUsers);

      const result = await userService.findPaginated(paginationDto);

      expect(result).toEqual(mockUsers);
      expect(redisService.getOrSet).toHaveBeenCalledWith(
        `findPaginated:0:20`,
        expect.any(Function),
      );
      expect(databaseService.db.select).not.toHaveBeenCalled();
    });

    it('should retrieve paginated users from the database if not cached', async () => {
      const paginationDto = { page: 0, size: 20 };

      mockRedisService.getOrSet.mockImplementation((key, fetch) => fetch());
      mockDatabaseService.db.execute.mockResolvedValue([mockUserEntity]);

      const result = await userService.findPaginated(paginationDto);

      expect(result).toEqual([mockUserResponse]);
      expect(redisService.getOrSet).toHaveBeenCalledWith(
        `findPaginated:0:20`,
        expect.any(Function),
      );
      expect(databaseService.db.select).toHaveBeenCalled();
      expect(databaseService.db.execute).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users from Redis if cached', async () => {
      const mockUsers = [mockUserResponse];

      mockRedisService.getOrSet.mockResolvedValue(mockUsers);

      const result = await userService.findAll();

      expect(result).toEqual(mockUsers);
      expect(redisService.getOrSet).toHaveBeenCalledWith(
        `findAll`,
        expect.any(Function),
      );
      expect(databaseService.db.select).not.toHaveBeenCalled();
    });

    it('should retrieve all users from the database if not cached', async () => {
      mockRedisService.getOrSet.mockImplementation((key, fetch) => fetch());
      mockDatabaseService.db.execute.mockResolvedValue([mockUserEntity]);

      const result = await userService.findAll();

      expect(result).toEqual([mockUserResponse]);
      expect(redisService.getOrSet).toHaveBeenCalledWith(
        `findAll`,
        expect.any(Function),
      );
      expect(databaseService.db.select).toHaveBeenCalled();
      expect(databaseService.db.execute).toHaveBeenCalled();
    });
  });
});
