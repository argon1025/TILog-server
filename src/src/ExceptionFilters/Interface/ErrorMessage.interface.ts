// 에러 인터페이스 구성요소중 errorMessage 인터페이스
export default interface errorMessage {
  en: string; // 반드시 영어 텍스트가 선언되어야 한다.
  kr?: string; // 옵션으로 한국어 텍스트를 추가 할당할 수 있다.
}
