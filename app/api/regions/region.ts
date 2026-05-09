import { request } from "../api";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { transformJobTypes } from "./helper"; // Import the appropriate helper function
import {
  TransformRegion,
  TransformRegionForFilters,
  getAllRegionsType,
} from "./regionTypes.types";
import urlcat from "urlcat";

export const getRegions = async (): Promise<
  SuccessResult<TransformRegion[]> | ErrorResult
> => {
  const response = await request({
    url: "/regions/",
    method: "get",
  });
  if (response.remote === "success") {
    response.data.data = transformJobTypes(response.data.data);
    return response;
  }
  return response;
};

export const getRegionsByFilter = async (
  payload: getAllRegionsType
): Promise<SuccessResult<TransformRegionForFilters> | ErrorResult> => {
  const { searchValue, pageNo, recordPerPage } = payload;
  const url = urlcat("/regions/get_all_federals", {
    searchValue,
    pageNo,
    recordPerPage,
  });

  const response = await request({
    url,
    method: "get",
  });
  if (response.remote === "success") {
    response.data.data.data = transformJobTypes(response.data.data.data);
    response.data.data.data.count = response.data.data.data.count;
    return response;
  }

  return response;
};

export const addRegion = async (
  name: string
): Promise<SuccessResult<TransformRegion> | ErrorResult> => {
  const response = await request({
    url: "/regions/",
    method: "post",
    data: { name },
  });
  return response;
};

export const editRegion = async (
  payload: TransformRegion
): Promise<SuccessResult<TransformRegion> | ErrorResult> => {
  const response = await request({
    url: "/regions/",
    method: "put",
    data: payload,
  });
  return response;
};

export const deleteRegion = async (
  id: string
): Promise<SuccessResult<TransformRegion> | ErrorResult> => {
  const response = await request({
    url: `/regions/${id}`,
    method: "delete",
  });
  return response;
};

export const getRegionByName = async (
  jobTypeName: string
): Promise<SuccessResult<TransformRegion> | ErrorResult> => {
  const response = await request({
    url: `/regions/find/${jobTypeName}`,
    method: "get",
  });

  if (response.remote === "success") {
    return response;
  }

  return response;
};
