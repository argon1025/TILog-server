export default class Time {
  nowDate(): string {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  }
  timer(timeSet: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeSet);
    });
  }
}
