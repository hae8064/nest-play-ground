import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUsers() {
    const users = await this.userRepository.find();
    return users;
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
}
