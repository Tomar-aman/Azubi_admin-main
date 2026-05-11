import { request } from "../api";
import urlcat from "urlcat";

export interface ManagedEmployee {
  _id: string;
  name: string;
  email: string;
  phoneNo?: string;
  position?: string;
  permissions: string[];
  status: "Active" | "Inactive";
  createdBy: string;
  createdByName?: string;
  createdAt: string;
}

export interface ManagedEmployeeFormValues {
  name: string;
  email: string;
  phoneNo?: string;
  position?: string;
  permissions: string[];
  status: "Active" | "Inactive";
}

export const getAllManagedEmployees = async (payload: {
  pageNo: number;
  recordPerPage: string;
  searchValue: string;
}) => {
  const { pageNo, recordPerPage, searchValue } = payload;
  const url = urlcat("/managed-employees", { pageNo, recordPerPage, searchValue });
  return request({ url, method: "GET" });
};

export const getManagedEmployeeById = async (id: string) => {
  return request({ url: `/managed-employees/${id}`, method: "GET" });
};

export const createManagedEmployee = async (data: ManagedEmployeeFormValues) => {
  return request({ url: "/managed-employees", method: "POST", data });
};

export const updateManagedEmployee = async (id: string, data: Partial<ManagedEmployeeFormValues>) => {
  return request({ url: `/managed-employees/${id}`, method: "PUT", data });
};

export const deleteManagedEmployee = async (id: string) => {
  return request({ url: `/managed-employees/${id}`, method: "DELETE" });
};

export const toggleManagedEmployeeStatus = async (id: string) => {
  return request({ url: `/managed-employees/${id}/toggle-status`, method: "PATCH" });
};
