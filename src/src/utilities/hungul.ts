export const chosung = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

export const chosungHangul = (str: string): string => {
  return str.split('').reduce((result: string, s: string) => {
    const code = s.charCodeAt(0) - 44032;

    if (code > -1 && code < 11172) {
      result += chosung[Math.floor(code / 588)];
    }
    return result;
  }, '');
};

export const isChosung = (str: string, chosungStr: string): boolean => {
  return str !== '' && chosungStr === '';
};
