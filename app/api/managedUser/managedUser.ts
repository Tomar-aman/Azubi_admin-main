import { request } from "../api";
import urlcat from "urlcat";
import {
  GetAllManagedUsersPayload,
  ManagedUserFormValues,
} from "./managedUser.types";

export const getAllManagedUsers = async (payload: {
  pageNo: number;
  recordPerPage: string;
  searchValue: string;
}) => {
  const { pageNo, recordPerPage, searchValue } = payload;
  const url = urlcat("/managed-users", { pageNo, recordPerPage, searchValue });
  return request({ url, method: "GET" });
};

export const getManagedUserById = async (id: string) => {
  return request({ url: `/managed-users/${id}`, method: "GET" });
};

export const createManagedUser = async (data: ManagedUserFormValues) => {
  return request({ url: "/managed-users", method: "POST", data });
};

export const updateManagedUser = async (id: string, data: Partial<ManagedUserFormValues>) => {
  return request({ url: `/managed-users/${id}`, method: "PUT", data });
};

export const deleteManagedUser = async (id: string) => {
  return request({ url: `/managed-users/${id}`, method: "DELETE" });
};

export const toggleManagedUserStatus = async (id: string) => {
  return request({ url: `/managed-users/${id}/toggle-status`, method: "PATCH" });
};
