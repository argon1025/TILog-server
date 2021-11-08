export class WriteNewCommentToCommentDTO {
  userID: number;
  postID: string;
  contents: string;
  replyLevel: number;
  replyTo: string;
}
