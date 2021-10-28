interface Response {
  error: boolean;
  message: string;
  data?: any;
}

export default class ResponseUtility {
  create(error: boolean, message: string, data?: any): Response {
    let response: Response = {
      error: error,
      message: message,
    };
    if (!!data) {
      response = { ...response, ...data };
    }
    return response;
  }
}
