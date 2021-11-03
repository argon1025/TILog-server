export default new (class Time {
  public nowDate(): string {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  }
  public timer(timeSet: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeSet);
    });
  }
})();
