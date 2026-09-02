export interface UploadPayload {
  file: File;
  title?: string;
}

export interface UploadProgressState {
  isUploading: boolean;
  progress: number;
}
