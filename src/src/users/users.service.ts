import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { callbackUserinfo } from 'src/auth/types/callbackUserinfo';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private userRepo: Repository<Users>) {}
  // 유저를 생성합니다.
  createUser(userInfo: callbackUserinfo) {
    const user = this.userRepo.create(userInfo);
    return this.userRepo.save(user);
  }
  // 특정 유저를 검색합니다.
  findUser(oAuthServiceId: string): Promise<Users | undefined> {
    return this.userRepo.findOne({ oAuthServiceId });
  }
}
