import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionInfo } from 'src/auth/dto/session-info.dto';
import { UserInfo } from 'src/auth/dto/userinfo.dto';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private userRepo: Repository<Users>) {}
  // 유저를 생성합니다.
  async createUser(userInfo: UserInfo) {
    const user = await this.userRepo.create(userInfo);
    return await this.userRepo.save(user);
  }
  // 특정 유저를 검색합니다.
  async findUser(oAuthServiceId: string): Promise<Users | undefined> {
    return await this.userRepo.findOne({
      select: ['id', 'oAuthType', 'oAuthServiceId', 'userName', 'mailAddress', 'createdAt', 'updatedAt', 'admin'],
      where: { oAuthServiceId },
    });
  }
}
