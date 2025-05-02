import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    console.log('req.user', req.user);

    // 사용자 정보 저장 또는 업데이트
    const user = await this.usersService.findOrCreateOAuthUser(req.user);

    // JWT 토큰 생성
    const payload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });

    const secretToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '2w',
    });

    return {
      accessToken,
      user,
      secretToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      if (!process.env.JWT_REFRESH_SECRET) {
        throw new UnauthorizedException('JWT_REFRESH_SECRET is not defined');
      }
      if (!process.env.JWT_SECRET) {
        throw new UnauthorizedException('JWT_SECRET is not defined');
      }

      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
      ) as { id: number; email: string };

      const user = await this.usersService.getUserById(payload.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      console.error('refreshAccessToken error', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
