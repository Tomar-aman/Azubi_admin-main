export interface City {
  _id: string;
  name: string;
  region?: string;
  startTime: string;
  endTime: string;
  address: string;
  zipCode: string;
  directionLink: string;
  status: boolean;
  popular:boolean
}

export interface RegionData {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface Region {
count: number;
data: RegionData[];
}
export interface TransformCity {
  id: string;
  name: string;
  region?: string;
  startTime: string;
  endTime: string;
  address: string;
  zipCode: string;
  directionLink: string;
  status: boolean;
  popular:boolean
}

export interface TransformRegionTypeAdd {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface TransformCityForFilters {
  data: TransformCity[];
  count: number;
}

export interface getAllCitiesType {
  searchValue: string;
  pageNo: number;
  recordPerPage: string;
}
export interface PaginationPayload extends getAllCitiesType {}
