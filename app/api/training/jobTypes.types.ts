export type TransformJobType = {
  id: string;
  name: string;
};



export type TransformJobTypeForFilters = {
  data: TransformJobType[];
  count: number;
};

export type JobTypes = {
  _id: string;
  name: string;

};

export type ImagesGallery = {
  _id: string;
  filepath: string;
  filename: string;
  type: string;
};

export type ImageGalleryType = {
  data: ImagesGallery[];
}


export interface getAllJobTypesType {
  searchValue: string;
  pageNo: number;
  recordPerPage: string;
}
