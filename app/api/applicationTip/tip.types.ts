export type TransformApplicationTip = {
  id?: string;
  title: string;
  description: string;
  // Add any other properties as needed
};

export type TransformApplicationTipForFilters = {
  data: TransformApplicationTip[];
  count: number;
};

export type ApplicationTip = {
  _id: string;
  title: string;
  description: string;
  // Add any other properties as needed
};

export interface GetAllApplicationTipsType {
  searchValue: string;
  pageNo: number;
  recordPerPage: string;
}

export interface GetAllTipsType {
  searchValue: string;
  pageNo: number;
  recordPerPage: string;
}
