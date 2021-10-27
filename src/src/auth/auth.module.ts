import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { UsersService } from 'src/users/users.service';
import { SessionSerializer } from './serializer/serializer';
import { GithubStrategy } from './strategies/github.strategy';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([Users])],
  controllers: [AuthController],
  providers: [AuthService, UsersService, SessionSerializer, GithubStrategy],
})
export class AuthModule {}
