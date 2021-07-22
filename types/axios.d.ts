export type ErrMsgMode = 'none' | 'modal' | 'message' | undefined;

export interface RequestOptions {
  // Format request parameter time
  formatDate?: boolean;
  // Whether to return native response headers
  // For example: use this attribute when you need to get the response headers
  isReturnNativeResponse?: boolean;
  // Whether to join url
  joinPrefix?: boolean;
  // Error message prompt type
  errMsgMode?: ErrMsgMode;
  // Whether to add a timestamp（默认 true）
  joinTime?: boolean;
  // 是否携带语言参数（默认 true）
  joinLocale?: boolean;
  // 是否忽略取消
  ignoreCancelToken?: boolean;
  // Whether to send token in header
  withToken?: boolean;
}

// multipart/form-data: upload file
export interface UploadFileParams {
  // Other parameters
  data?: Recordable;
  // File parameter interface field name
  name?: string;
  // file name
  file: File | Blob;
  // file name
  filename?: string;
  [key: string]: any;
}
