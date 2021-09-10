import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/entities/Comments';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(@InjectRepository(Comments) private commentsRepo: Repository<Comments>) {}
}
