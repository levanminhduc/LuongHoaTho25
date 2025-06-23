import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

interface LoginDto {
  username: string;
  password: string;
}

interface AuthResult {
  access_token: string;
  user: {
    username: string;
    role: string;
  };
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    // Hardcoded admin credentials (migrate từ hệ thống cũ)
    if (username === 'admin' && password === 'admin123') {
      return {
        username: 'admin',
        role: 'admin',
      };
    }

    // Employee login logic (simplified - in production, use proper password hashing)
    // Employee username: Chấp nhận mọi loại ký tự (ma_nv, CCCD, etc.)
    // Password: CCCD (12 digits)
    if (username && username.trim() !== '' && password.length === 12) {
      return {
        username: username,
        role: 'employee',
      };
    }

    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResult> {
    const { username, password } = loginDto;

    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    const payload = { username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        username: user.username,
        role: user.role,
      },
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }
}
