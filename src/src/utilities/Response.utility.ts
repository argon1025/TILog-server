export default new (class ResponseUtility {
  create(error: boolean, message: string, data?: any) {
    let response = {
      error: error,
      message: message,
    };
    if (!!data) {
      response = { ...response, ...data };
    }
    return response;
  }
})();
