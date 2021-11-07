import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionInfo } from 'src/auth/dto/session-info.dto';
import { UserInfo } from 'src/auth/dto/userinfo.dto';
import { Users } from 'src/entities/Users';
import { UserCreateFailed } from 'src/ExceptionFilters/Errors/Users/User.error';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private userRepo: Repository<Users>) {}
  // 유저를 생성합니다.
  async createUser(userInfo: UserInfo): Promise<SessionInfo | UserCreateFailed> {
    try {
      // DB에 유저를 생성합니다.
      const user = await this.userRepo.create(userInfo);
      return await this.userRepo.save(user);
    } catch (error) {
      // 에러 생성
      throw new UserCreateFailed(`service.user.createUser.${!!error.message ? error.message : 'Unknown_Error'}`);
    }
  }
  // 특정 유저를 검색합니다.
  async findUser(oAuthServiceId: string): Promise<Users | undefined> {
    return await this.userRepo.findOne({
      select: ['id', 'oAuthType', 'oAuthServiceId', 'userName', 'mailAddress', 'createdAt', 'updatedAt', 'admin'],
      where: { oAuthServiceId },
    });
  }
}
