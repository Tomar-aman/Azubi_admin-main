import { request } from "../api";
import { TransformRegion } from "../regions/regionTypes.types";
import { ErrorResult, SuccessResult } from "../runtimeType";
import {
  City,
  TransformCity,
  TransformCityForFilters,
  TransformRegionTypeAdd,
  getAllCitiesType,
} from "./city.types";
import { transformCities, transformRegions } from "./helper";
import urlcat from "urlcat";


export const getCity = async (): Promise<
  SuccessResult<TransformCity[]> | ErrorResult
> => {
  const response = await request({
    url: "/cities/",
    method: "get",
  });
  if (response.remote === "success") {
    response.data.data = transformCities(response.data.data);
    return response;
  }
  return response;
};


export const getRegion = async (): Promise<
  SuccessResult<TransformRegionTypeAdd[]> | ErrorResult
> => {
  const response = await request({
    url: "/regions/get_all_federals",
    method: "get",
  });
  if (response.remote === "success") {
    response.data.data = transformRegions(response.data.data);
    return response;
  }
  return response;
};




export const getCitiesByFilter = async (
  payload: getAllCitiesType
): Promise<SuccessResult<TransformCityForFilters> | ErrorResult> => {
  const { searchValue, pageNo, recordPerPage } = payload;
  const url = urlcat("/cities/get_all_city", {
    searchValue,
    pageNo,
    recordPerPage,
  });

  const response = await request({
    url,
    method: "get",
  });
  if (response.remote === "success") {
    response.data.data.data = transformCities(response.data.data.result);
    response.data.data.data.count = response.data.data.data.count;
    return response;
  }

  return response;
};


export const addCity = async (
  data: City
): Promise<SuccessResult<TransformCity> | ErrorResult> => {
  const response = await request({
    url: "/cities/",
    method: "post",
    data,
  });
  return response;
};

export const editCity = async (
  payload: TransformCity
): Promise<SuccessResult<TransformCity> | ErrorResult> => {
  const response = await request({
    url: "/cities/",
    method: "put",
    data: payload,
  });
  return response;
};

export const editCityStatus = async (
  payload: {id:string, status:boolean}
): Promise<SuccessResult<TransformCity> | ErrorResult> => {
  const response = await request({
    url: "/cities/",
    method: "put",
    data: payload,
  });
  return response;
};

export const deleteCity = async (
  id: string
): Promise<SuccessResult<TransformCity> | ErrorResult> => {
  const response = await request({
    url: `/cities/${id}`,
    method: "delete",
  });
  return response;
};
export const manageCityContent = async (): Promise<
  SuccessResult<any[]> | ErrorResult
> => {
  const response = await request({
    url: "/cites-content/manage-cities-content",
    method: "get",
  });
  return response;
};
export const updateCityContent = async (payload:any): Promise<
  SuccessResult<any[]> | ErrorResult
> => {
  const response = await request({
    url: "/cites-content/manage-cities-content",
    method: "put",
    data:payload
  });
  return response;
};
export const getGalleryImages = async (): Promise<
  SuccessResult<any[]> | ErrorResult
> => {
  const response = await request({
    url: "/manage-home-gallery/manage-homepage",
    method: "Get",
  });
  return response;
};


export const updateGalleryImages = async (data:any): Promise<
  SuccessResult<any[]> | ErrorResult
> => {
  const response = await request({
    url: "/manage-home-gallery/manage-homepage",
    method: "PUT",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const getFooterImages = async (): Promise<
  SuccessResult<any[]> | ErrorResult
> => {
  const response = await request({
    url: "/footer-images/",
    method: "Get",
  });
  return response;
};
export const updateFooterImages = async (data:any): Promise<
  SuccessResult<any[]> | ErrorResult
> => {
  const response = await request({
    url: "/footer-images/",
    method: "PUT",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const getLandingPageImages = async (): Promise<
  SuccessResult<any[]> | ErrorResult
> => {
  const response = await request({
    url: "/landing-page-images/",
    method: "Get",
  });
  return response;
};
export const updateLandingPageImages = async (data:any): Promise<
  SuccessResult<any[]> | ErrorResult
> => {
  const response = await request({
    url: "/landing-page-images/",
    method: "PUT",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};