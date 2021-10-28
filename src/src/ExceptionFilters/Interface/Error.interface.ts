import errorMessage from './ErrorMessage.interface';

// 에러 인터페이스
export default interface Error {
  codeNumber: number; // 에러코드
  codeText: string;
  message: errorMessage; // 에러메시지 객체
  description?: string; // 커스텀 개발자 코멘트
}
