import { ActionPayload } from ".";

export interface RespData<T = {}> {
  errno: number,
  data: T,
  message?: string,
  payload?: ActionPayload,
}

export interface UploadData {
  urls: string[]
}

export type RespUploadData = RespData<UploadData>;