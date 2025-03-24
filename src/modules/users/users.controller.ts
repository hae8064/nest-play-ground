import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginReqDto } from './dto/loginReq.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 회원가입
  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  // 로그인
  @Post('login')
  login(@Body() body: LoginReqDto) {
    return this.usersService.login(body);
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  getUser(@Param('id') id: number) {
    return this.usersService.getUserById(id);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}
