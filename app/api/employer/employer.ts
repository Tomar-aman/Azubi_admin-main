import {
  Employer,
  EmployerFormType,
  EmployerWithIndustriesTypeAndId,
} from "./employer.types";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { request } from "../api";
import {
  DropDownResponse,
  EmployeesListResponse,
  PartialUpdateEmployerType,
  TransformedRowDataWithCount,
  UpdateEmployerType,
  getAllEmployerType,
  transFormSignalApiData,
  transformApiData,
} from "./helper";
import urlcat from "urlcat";
import { Companies } from "@/app/(user)/manage-jobs/add/page";
import { IconWithContent } from "@/app/(user)/manage-employers";

export const getAllEmployers = async (
  payload: getAllEmployerType
): Promise<SuccessResult<TransformedRowDataWithCount> | ErrorResult> => {
  const { searchValue, pageNo, filter, recordPerPage } = payload;
  const url = urlcat("/employer/", {
    searchValue,
    pageNo,
    filter,
    recordPerPage,
  });

  const response = await request({
    url,
    method: "GET",
  });

  if (response.remote === "success") {
    const transformedData = response.data.data.employers.map(
      (employer: Employer) => transformApiData(employer)
    );
    response.data.data.data = transformedData;
    return response;
  } else {
    return response;
  }
};

export const getEmployeesList = async (): Promise<
  SuccessResult<EmployeesListResponse> | ErrorResult
> => {
  const response = await request({
    url: "/employer/employees",
    method: "GET",
  });
  return response;
};

export const getJobListByCompanyIdApi = async (
  id: string
): Promise<SuccessResult<DropDownResponse> | ErrorResult> => {
  const response = await request({
    url: `/employer/job-list/${id}`,
    method: "GET",
  });
  return response;
};
export const editEmployer = async (
  payload: UpdateEmployerType | PartialUpdateEmployerType
): Promise<SuccessResult<UpdateEmployerType> | ErrorResult> => {
  const formData = new FormData();

  // Convert each field in payload to form data
  for (const key in payload) {
    if (payload.hasOwnProperty(key)) {
      // @ts-ignore
      formData.append(key, payload[key]);
    }
  }
  const response = await request({
    url: `/employer/${payload.id}`,
    method: "put",
    data: payload,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

export const deleteEmployer = async (id: string) => {
  const url = urlcat("/employer/", {
    id,
  });
  const response = await request({
    url,
    method: "delete",
  });
  return response;
};

export const addEmployer = async (
  payload: EmployerWithIndustriesTypeAndId | EmployerFormType,
  additionalData: IconWithContent[] = []
): Promise<SuccessResult<EmployerFormType> | ErrorResult> => {
  const prepareAdditionalData: any = {};

  additionalData.forEach((obj: any, idx: any) => {
    if (obj.oldImage) {
      prepareAdditionalData[`objects[${idx}][oldImage]`] = obj.oldImage;
    }
    prepareAdditionalData[`objects[${idx}][_id]`] = obj._id;
    if (obj.image) prepareAdditionalData[`objects[${idx}][image]`] = obj.image;
    prepareAdditionalData[`objects[${idx}][text]`] = obj.text;
  });

  const response = await request({
    url: "/employer/",
    method: "post",
    data: {
      ...payload,
      videoLink: JSON.stringify(payload.videoLink),
      industryName: payload?.industryName?.id,
      city: payload.city.id,
      ...prepareAdditionalData,
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const getEmployerById = async (
  id: string
): Promise<SuccessResult<EmployerWithIndustriesTypeAndId> | ErrorResult> => {
  const response = await request({
    url: `/employer/${id}`,
    method: "get",
  });
  if (response.remote === "success") {
    const addi = { ...response.data.data };
    response.data.data = {
      ...transFormSignalApiData(response.data.data.data),
      companyImages: response?.data?.data?.images,
      additionalData: addi?.data?.additionalData || [],      
      companyImagePath:addi?.newImage?.filepath
    };
    // response.data.data.companyImages = response?.data?.data?.images;
  }
  return response;
};

export const updateEmployerById = async (
  id: string,
  updatedData: EmployerFormType | EmployerWithIndustriesTypeAndId,
  additionalData: IconWithContent[] = []
): Promise<SuccessResult<EmployerWithIndustriesTypeAndId> | ErrorResult> => {
  console.log({id,updatedData,additionalData})
  const formData = new FormData();

  Object.entries({
    ...updatedData,
    industryName: updatedData.industryName.id,
    city: updatedData.city.id,
  }).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(`${key}`, item);
      });
    } else {
      formData.append(key, value);
    }
  });

  additionalData.forEach((obj: any, idx: any) => {
    formData.append(`objects[${idx}][_id]`, obj._id);
    if (obj.image) formData.append(`objects[${idx}][image]`, obj.image);
    formData.append(`objects[${idx}][text]`, obj.text);
    if (obj.oldImage) {
      formData.append(`objects[${idx}][oldImage]`, obj.oldImage);
    }
  });
  const response = await request({
    url: `/employer/${id}`,
    method: "put",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const getCompaniesByCityIdApi = async (
  id: string[]
): Promise<SuccessResult<Companies[]> | ErrorResult> => {
  const response = await request({
    url: `/employer/get-employer-by-city-id/${id}`,
    method: "get",
  });
  return response;
};
