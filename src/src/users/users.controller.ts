import { Controller, Get, Param, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // 로그인한 유저 정보를 반환합니다.
  @Version('1')
  @Get(':username')
  @ApiOperation({ summary: '유저 정보를 반환합니다.' })
  async userInfo(@Param('username') username: string) {
    try {
      return await this.usersService.findUserToUserName(username);
    } catch (error) {}
  }
}
