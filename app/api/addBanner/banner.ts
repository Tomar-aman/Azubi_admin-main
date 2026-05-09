import { ErrorResult, SuccessResult } from "../runtimeType";
import { request } from "../api";
import urlcat from "urlcat";
import { Companies } from "@/app/(user)/manage-jobs/add/page";
import { PaginationPayload } from "../city/city.types";

interface BannerPaylaod {
  job: string;
  jobUrl: string;
  industry: string;
  city: string;
  typesOfJobs: string;
  companyName: string;
  bannerTitle: string;
  images: File[];
  embeddedCode: string;
  oldImages: string;
}

interface Image {
  _id: string;
  path: string;
  fileName: string;
}

interface Employer {
  companyName: string;
  _id: string;
}

interface City {
  cityName: string;
  _id: string;
}

interface Job {
  jobName: string;
  _id: string;
}

interface Industry {
  jobName: string;
  _id: string;
}

interface TypesOfJobs {
  jobTypeName: string;
  _id: string
}

export interface Banner {
  _id: string;
  bannerTitle: string;
  jobUrl: string;
  images: Image[];
  employers: Employer;
  city: City;
  jobs: Job;
  industry: Industry;
  jobType: any;
  jobTypeName: any;
  typesOfJobs: TypesOfJobs;
  embeddedCode: string;
}

interface BannerResponse {
  status: number;
  message: string;
  data: { count: number; data: Banner[] };
}

export const addBannerApi = async (
  payload: BannerPaylaod
): Promise<SuccessResult<any> | ErrorResult> => {
  const formData = new FormData();

  // Convert each field in payload to form data
  payload.images.forEach((item) => {
    formData.append("images", item);
  });
  for (const key in payload) {
    if (key !== "images") {
      // @ts-ignore
      if (payload[key] !== "") formData.append(key, payload[key]);
    }
  }
  const response = await request({
    url: "/banner/",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const getBanners = async (
  payload: PaginationPayload
): Promise<SuccessResult<BannerResponse> | ErrorResult> => {
  const { searchValue, pageNo, recordPerPage } = payload;
  const response = await request({
    url: urlcat("/banner", {
      search: searchValue,
      pageNo,
      recordPerPage,
    }),
    method: "GET",
  });
  return response;
};

export const deleteBannerApi = async (
  id: string
): Promise<SuccessResult<BannerResponse> | ErrorResult> => {
  const response = await request({
    url: `/banner/${id}`,
    method: "DELETE",
  });
  return response;
};

export const updateBannerApi = async (
  payload: any
): Promise<SuccessResult<any> | ErrorResult> => {
  const formData = new FormData();

  // Convert each field in payload to form data
  if (payload?.images) {
    payload.images.forEach((item: any) => {
      formData.append("images", item);
    });
  }
  for (const key in payload) {
    if (key !== "images") {
      // @ts-ignore
      if (payload[key] !== "") formData.append(key, payload[key]);
    }
  }
  const response = await request({
    url: "/banner",
    method: "PUT",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};
