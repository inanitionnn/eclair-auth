import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import { UserResponse } from './responses';
import { PaginationDto, IdParamDto } from '../../shared/dtos';
import { UserEntity } from './dtos';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUser: UserResponse = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
  };

  const mockUserService = {
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findPaginated: jest.fn().mockResolvedValue([mockUser]),
    findById: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await userController.findAll();

      expect(result).toEqual([mockUser]);
      expect(userService.findAll).toHaveBeenCalled();
    });
  });

  describe('findPaginated', () => {
    it('should return paginated users', async () => {
      const paginationDto: PaginationDto = { page: 1, size: 10 };
      const result = await userController.findPaginated(paginationDto);

      expect(result).toEqual([mockUser]);
      expect(userService.findPaginated).toHaveBeenCalledWith(paginationDto);
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const params: IdParamDto = { id: '1' };
      const result = await userController.findById(params);

      expect(result).toEqual(mockUser);
      expect(userService.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user is not found', async () => {
      const params: IdParamDto = { id: '2' };
      mockUserService.findById.mockResolvedValue(null);

      await expect(userController.findById(params)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should return the current user', async () => {
      const currentUser: UserEntity = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
      };

      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await userController.getCurrentUser(currentUser);

      expect(result).toEqual(mockUser);
      expect(userService.findById).toHaveBeenCalledWith(currentUser.id);
    });
  });
});
