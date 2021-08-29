import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { callbackUserinfo } from './types/callbackUserinfo';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(Users) private userRepo: Repository<Users>, private usersService: UsersService) {}

  /**
   * 유저 데이터가 유저가 서비스에 가입되어있는지 확인합니다.
   * 1. 유저정보가 없을 경우 유저를 생성 후 반환합니다.
   * 2. 유저 정보가 있을 경우 DB의 정보를 반환합니다.
   */
  async validateUser(userinfo: callbackUserinfo) {
    console.log('validateUser');
    const { oAuthServiceId } = userinfo;
    console.log(userinfo);
    const user = await this.userRepo.findOne({ oAuthServiceId });
    if (!user) {
      console.log('createUser');
      return this.usersService.createUser(userinfo);
    }
    console.log('returnUser');
    return user;
  }
}
