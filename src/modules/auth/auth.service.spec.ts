import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/dtos';
import { RegisterDto } from './dtos';

const mockUserService = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const user: Partial<UserEntity> = {
        id: '1',
        email: 'test@example.com',
        password: bcrypt.hashSync('password', 10),
      };
      userService.findByEmail = jest.fn().mockResolvedValue(user);

      const result = await authService.validateUser(
        'test@example.com',
        'password',
      );

      expect(result).toEqual(user);
      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should throw BadRequestException if user is not found', async () => {
      userService.findByEmail = jest.fn().mockResolvedValue(null);

      await expect(
        authService.validateUser('test@example.com', 'password'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if password does not match', async () => {
      const user: Partial<UserEntity> = {
        id: '1',
        email: 'test@example.com',
        password: bcrypt.hashSync('wrongpassword', 10),
      };
      userService.findByEmail = jest.fn().mockResolvedValue(user);

      await expect(
        authService.validateUser('test@example.com', 'password'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const user: Partial<UserEntity> = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword',
      };
      jwtService.sign = jest.fn().mockReturnValue('token');

      const result = await authService.login(user as UserEntity);

      expect(result).toEqual({ accessToken: 'token' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        id: user.id,
      });
    });
  });

  describe('register', () => {
    it('should throw BadRequestException if email already exists', async () => {
      const dto: RegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password',
      };
      userService.findByEmail = jest.fn().mockResolvedValue(true);

      await expect(authService.register(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create user and return access token', async () => {
      const dto: RegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password',
      };
      const user: Partial<UserEntity> = {
        id: '1',
        email: dto.email,
        password: 'hashedpassword',
      };
      userService.findByEmail = jest.fn().mockResolvedValue(null);
      userService.create = jest.fn().mockResolvedValue(user);
      jwtService.sign = jest.fn().mockReturnValue('token');
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => {
        return 'hashedpassword';
      });

      const result = await authService.register(dto);

      expect(result).toEqual({ accessToken: 'token' });
      expect(userService.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(userService.create).toHaveBeenCalledWith({
        ...dto,
        password: 'hashedpassword',
      });
    });
  });
});
