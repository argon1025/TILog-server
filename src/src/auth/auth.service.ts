import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { SessionInfo } from './dto/session-info.dto';
import { UserInfo } from './dto/userinfo.dto';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(Users) private userRepo: Repository<Users>, private usersService: UsersService) {}

  /**
   * 유저 데이터가 유저가 서비스에 가입되어있는지 확인합니다.
   * 1. 유저정보가 없을 경우 유저를 생성 후 반환합니다.
   * 2. 유저 정보가 있을 경우 DB의 정보를 반환합니다.
   */
  async validateUser(userinfo: UserInfo) {
    // 깃허브 아이디
    const { oAuthServiceId } = userinfo;
    // DB에 해당하는 깃허브 아이디 찾기
    const user: SessionInfo = await this.usersService.findUser(oAuthServiceId);
    // 서비스에 가입되어있는 사용자인지 확인
    if (!user) {
      // 없으면 DB에 추가 후 유저정보 반환
      return await this.usersService.createUser(userinfo);
    }
    // 가입되어 있으면 유저정보 반환
    return user;
  }
}
