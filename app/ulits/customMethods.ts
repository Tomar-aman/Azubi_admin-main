import axios from "axios";
import { v4 } from "uuid";
import { request } from "../api/api";

export function cardFactory<T>(object: T, count: number): T[] {
  return Array.from({ length: count }, () => ({ ...object, _id: v4() }));
}

export const fetchFileContent = async (fileUrl: string) => {
  const response = await request({
    url: "/dynamic-footer/fetch-image",
    method: "post",
    data: {
      imageUrl: fileUrl,
    },
  });
  return response;
};
