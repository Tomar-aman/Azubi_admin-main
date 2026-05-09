export type TransformRegion = {
  id: string;
  name: string;
};

export type TransformRegionForFilters = {
  data: TransformRegion[];
  count: number;
};

export type Region = {
  _id: string;
  name: string;
};

export interface getAllRegionsType {
  searchValue: string;
  pageNo: number;
  recordPerPage: string;
}
