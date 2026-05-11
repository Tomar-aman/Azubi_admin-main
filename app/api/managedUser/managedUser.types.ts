// Types for Manage User
export interface ManagedUser {
  _id: string;
  username: string;
  email: string;
  permissions: string[];
  status: "Active" | "Inactive";
  createdBy?: string;
  createdByName?: string;
  createdAt: string;
}

export interface ManagedUserFormValues {
  username: string;
  email: string;
  password: string;
  permissions: string[];
  status: "Active" | "Inactive";
}

export interface GetAllManagedUsersPayload {
  pageNo: number;
  recordPerPage: string;
  searchValue: string;
}
