import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { LoginReqDto } from './dto/loginReq.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async getUsers() {
    const users = await this.userRepository.find();
    return users;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(body: CreateUserDto) {
    // password 암호화
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = this.userRepository.create({
      ...body,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async login(body: LoginReqDto) {
    const user = await this.userRepository.findOne({
      where: { email: body.email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (await bcrypt.compare(body.password, user.password)) {
      // user를 반환하는게 아니라 토큰을 반환해야 함
      const payload = { id: user.id, email: user.email };

      // Access Token 생성
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      });

      // Refresh Token 생성
      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '2w',
      });

      return {
        accessToken,
        refreshToken,
      };
    }
    throw new UnauthorizedException('Invalid password');
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.remove(user);
    return { success: true, message: `${user.email} deleted successfully` };
  }

  async updateUser(id: number, body: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (body.password) {
      if (body.password !== body.confirmPassword) {
        throw new BadRequestException(
          'Password and confirmPassword do not match',
        );
      }
      const hashedPassword = await bcrypt.hash(body.password, 10);
      user.password = hashedPassword;
    }

    if (body.name) {
      user.name = body.name;
    }

    await this.userRepository.save(user);
    return {
      success: true,
      message: 'User updated successfully',
    };
  }
}
