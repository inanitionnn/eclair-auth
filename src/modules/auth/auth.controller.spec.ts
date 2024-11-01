import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos';
import { AccessToken } from './types';
import { BadRequestException } from '@nestjs/common';

const mockAuthService = {
  login: jest.fn(),
  register: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return access token on successful login', async () => {
      const mockRequest = { user: { email: 'test@example.com', id: 1 } };
      const mockAccessToken: AccessToken = { accessToken: 'token' };

      authService.login = jest.fn().mockResolvedValue(mockAccessToken);

      const result = await authController.login(mockRequest as any);

      expect(result).toEqual(mockAccessToken);
      expect(authService.login).toHaveBeenCalledWith(mockRequest.user);
    });
  });

  describe('register', () => {
    it('should return access token on successful registration', async () => {
      const registerDto: RegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password',
      };
      const mockAccessToken: AccessToken = { accessToken: 'token' };

      authService.register = jest.fn().mockResolvedValue(mockAccessToken);

      const result = await authController.register(registerDto);

      expect(result).toEqual(mockAccessToken);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw BadRequestException if registration fails', async () => {
      const registerDto: RegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password',
      };

      authService.register = jest
        .fn()
        .mockRejectedValue(new BadRequestException('Email already exists'));

      await expect(authController.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });
});
