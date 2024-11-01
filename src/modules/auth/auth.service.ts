import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/dtos';
import { AccessToken } from './types';
import { RegisterDto } from './dtos';
import { UserResponse } from '../users/responses';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  public async login(user: UserEntity | UserResponse): Promise<AccessToken> {
    const payload = { email: user.email, id: user.id };
    return { accessToken: this.jwtService.sign(payload) };
  }

  public async register(dto: RegisterDto): Promise<AccessToken> {
    const existingUser = await this.userService.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
    const newUserData = { ...dto, password: hashedPassword };
    const user = await this.userService.create(newUserData);

    return this.login(user);
  }
}
