import { request } from "../api";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { transformApplicationTips } from "./helper";
import {
  TransformApplicationTip,
  TransformApplicationTipForFilters,
  GetAllApplicationTipsType,
} from "./tip.types";
import urlcat from "urlcat";

export const getTips = async (): Promise<
  SuccessResult<TransformApplicationTip[]> | ErrorResult
> => {
  const response = await request({
    url: "/tips/",
    method: "get",
  });
  if (response.remote === "success") {
    response.data.data = transformApplicationTips(response.data.data);
    return response;
  }
  return response;
};

export const getTipsByFilter = async (
  payload: GetAllApplicationTipsType
): Promise<SuccessResult<TransformApplicationTipForFilters> | ErrorResult> => {
  const { searchValue, pageNo, recordPerPage } = payload;
  const url = urlcat("/tips/get_all_tips", {
    searchValue,
    pageNo,
    recordPerPage,
  });

  const response = await request({
    url,
    method: "get",
  });
  if (response.remote === "success") {
    response.data.data.data = transformApplicationTips(response.data.data.data);
    response.data.data.data.count = response.data.data.data.count;
    return response;
  }

  return response;
};

export const addTip = async (
  tipData: TransformApplicationTip
): Promise<SuccessResult<TransformApplicationTip> | ErrorResult> => {
  const response = await request({
    url: "/tips/",
    method: "post",
    data: tipData,
  });
  return response;
};

export const editTip = async (
  tipData: TransformApplicationTip
): Promise<SuccessResult<TransformApplicationTip> | ErrorResult> => {
  const response = await request({
    url: "/tips/update",
    method: "put",
    data: tipData,
  });
  return response;
};

export const deleteTip = async (
  id: string
): Promise<SuccessResult<TransformApplicationTip> | ErrorResult> => {
  const response = await request({
    url: `/tips/${id}`,
    method: "delete",
  });
  return response;
};
