export type TransformContact = {
  id?: string;
  name: string;
  phoneNumber: string;
  email: string;
  message: string;
};

export type TransformContactForFilters = {
  data: TransformContact[];
  count: number;
};

export type Contact = {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  message: string;
};

export interface GetAllContactsType {
  searchValue: string;
  pageNo: number;
  recordPerPage: string;
}
