import { ErrorResult, SuccessResult } from "../runtimeType";
import { request } from "../api";
import { ImageGalleryType } from "../training/jobTypes.types";

export const getAllImageGallery = async (
  ): Promise<SuccessResult<ImageGalleryType[]> | ErrorResult> => {
    const response = await request({
      url: "/front-ends/companies/all-media",
      method: "get",
    });
  
    if (response.remote === "success") {
      return response;
    }
  
    return response;
  };
  