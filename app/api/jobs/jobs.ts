import {
  Companies,
  NewJob,
  NewJobResponse,
} from "@/app/(user)/manage-jobs/add/page";
import { request } from "../api";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { transformJobsData } from "./helper";
import { Job, JobWithCount, UpdateJob, getAllJobsType } from "./jobs.types";
import urlcat from "urlcat";
import { IconWithContent } from "@/app/(user)/manage-employers";
// Function to get all employers
export const getAllJobs = async (
  payload: getAllJobsType
): Promise<SuccessResult<JobWithCount> | ErrorResult> => {
  const { searchValue, pageNo, filter, recordPerPage } = payload;
  const url = urlcat("/job/", {
    searchValue,
    pageNo,
    filter,
    recordPerPage,
  });
  const response = await request({
    url,
    method: "get",
  });
  if (response.remote === "success") {
    response.data.data.data = transformJobsData(response.data.data.jobs);
    response.data.data.data.count = response.data.data.count;
    return response;
  }
  return response;
};

export const updateJob = async (
  payload: UpdateJob | NewJob,
  additionalData: IconWithContent[] = []
) => {
  const formData = new FormData();
  const desktopViewPayload: any = {};
  if ((payload as NewJob).isDesktopView) {
    desktopViewPayload.training = (payload as NewJob).training?.id;
    desktopViewPayload.beginning = (payload as NewJob).beginning?.id;
    desktopViewPayload.federalState = (payload as NewJob).federalState?.id;
  }
  const { training, federalState, beginning, ...rest } = payload as NewJob;
  Object.entries({
    ...rest,
    company: payload.company?.id,
    industryName: payload.industryName?.id,
    ...desktopViewPayload,
    region: payload.region,
    city: payload.city?.id,
  }).forEach(([key, value]) => {
    if (
      !value &&
      value !== false &&
      key !== "startDate" &&
      key !== "embeddedCode" &&
      key !== "training" &&
      key !== "beginning" &&
      key !== "federalState"
    ) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(`${key}`, item);
      });
    } else {
      //@ts-ignore
      formData.append(key, value);
    }
  });

  additionalData.forEach((obj: any, idx: any) => {
    if (obj.oldImage) {
      formData.append(`objects[${idx}][oldImage]`, obj.oldImage);
    }
    formData.append(`objects[${idx}][_id]`, obj._id);
    if (obj.image) formData.append(`objects[${idx}][image]`, obj.image);
    formData.append(`objects[${idx}][text]`, obj.text);
  });

  const response = await request({
    url: `/job/${payload.id}`,
    method: "put",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const deleteJOb = async (id: string) => {
  const response = await request({
    url: `/job/${id}`,
    method: "delete",
  });
  return response;
};

export const addJob = async (
  payload: NewJob,
  additionalData: IconWithContent[] = []
) => {
  const formData = new FormData();
  const desktopViewPayload: any = {};
  if (payload.isDesktopView) {
    desktopViewPayload.training = payload.training?.id;
    desktopViewPayload.beginning = payload.beginning?.id;
    desktopViewPayload.federalState = payload.federalState?.id;
  }
  Object.entries({
    ...payload,
    company: payload.company.id,

    industryName: payload.industryName.id,
    ...desktopViewPayload,
    city: payload?.city?.id,
    region: payload.region,
  }).forEach(([key, value]) => {
    if (!value && key !== "startDate") {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(`${key}`, item);
      });
    } else {
      //@ts-ignore
      formData.append(key, value);
    }
  });
  additionalData.forEach((obj: any, idx: any) => {
    if (obj.oldImage) {
      formData.append(`objects[${idx}][oldImage]`, obj.oldImage);
    }
    formData.append(`objects[${idx}][_id]`, obj._id);
    if (obj.image) formData.append(`objects[${idx}][image]`, obj.image);
    formData.append(`objects[${idx}][text]`, obj.text);
  });

  const response = await request({
    url: "/job/",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const getJobDetailById = async (
  id: string
): Promise<SuccessResult<NewJobResponse> | ErrorResult> => {
  const response = await request({
    url: `/job/${id}`,
    method: "get",
  });
  return response;
};
