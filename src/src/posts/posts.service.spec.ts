import { Test, TestingModule } from '@nestjs/testing';
import { Connection, QueryRunner } from 'typeorm';
import { PostsService } from './posts.service';

// 관련 테스트끼리 통합한다
describe('PostsService', () => {
  let service: PostsService;
  // TypeORM connection
  let connection: Connection;

  const qr = {
    manager: {},
  } as QueryRunner;

  class ConnectionMock {
    createQueryRunner(mode?: 'master' | 'slave'): QueryRunner {
      return qr;
    }
  }

  // 각 테스트 이전마다 설정
  beforeEach(async () => {
    // 쿼리러너 mocking
    Object.assign(qr.manager, {
      save: jest.fn(),
    });
    qr.connect = jest.fn();
    qr.release = jest.fn();
    qr.startTransaction = jest.fn();
    qr.commitTransaction = jest.fn();
    qr.rollbackTransaction = jest.fn();
    qr.release = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: Connection,
          useClass: ConnectionMock,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    connection = module.get<Connection>(Connection);
    console.log('reset');
  });

  it('PostsService가 생성되어 있습니다.', () => {
    expect(service).toBeDefined();
  });

  // getPostWriterId 함수 테스트
  describe('getPostWriterId()', () => {
    it.todo('함수가 정상적으로 선언되었습니다.');
    it('함수가 정상적으로 선언되었습니다.', () => {
      expect(service.getPostWriterId).toBeDefined();
    });
    it.todo('정상적으로 찾은 데이터를 반환했습니다.');
    it.todo('정상적으로 롤백이 실행되고 에러 헨들러를 반환했습니다.');
    it.todo('커넥션이 정상적으로 종료되었습니다.');
  });
});
