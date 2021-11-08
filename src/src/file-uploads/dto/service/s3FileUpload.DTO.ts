export class S3FileUploadDto {
  fileRaw: Buffer;
  fileName: string;
  mimeType: string;
}

export class S3FileUploadResponseDto {
  location: string;
  // fileName = S3.Key
  fileName: string;
}
