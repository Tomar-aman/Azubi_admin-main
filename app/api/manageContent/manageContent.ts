import { HomePageContent } from "@/app/(user)/manage-content/home-page/page";
import { request } from "../api";
import { ErrorResult, SuccessResult } from "../runtimeType";
import {
  AboutBanner,
  AboutResponseI,
  AboutTextBlock,
  AccordionPayLoadForApi,
  ApplyFormContent,
  CardContentI,
  CompanyContent,
  ContactModel,
  ContactModelType,
  ContactUResponseType,
  ContactUs,
  ContactUsUpdateField,
  EmailContent,
  FAQ,
  FaqHeaderPayloadForAPi,
  FooterContent,
  FooterContentType,
  GoogleMapType,
  HandleUpdateOperationField,
  HomeContent,
  HomePage,
  HomePageOperationField,
  IconSectionPayLoadForAPi,
  JobMarketContent,
  JobWallContent,
  JobWallUpdateField,
  MagazineContactType,
  MagazineOrderResponse,
  MagazineOrderUpdateField,
  ManageAlert,
  ManageContentEditTypes,
  ManageContentTypes,
  SideBarContent,
} from "./manageContent.Types";
import { FileState } from "@/app/ulits/cropper";

export const getAllContents = async (): Promise<
  SuccessResult<ManageContentTypes> | ErrorResult
> => {
  const response = await request({
    url: "/manage_content/",
    method: "get",
  });
  return response;
};

export const EditContents = async (
  payload: ManageContentEditTypes
): Promise<SuccessResult<ManageContentEditTypes> | ErrorResult> => {
  const response = await request({
    url: "/manage_content/",
    method: "put",
    data: payload,
  });
  return response;
};

export const getAllAlertContent = async (
  id: string
): Promise<SuccessResult<ManageAlert> | ErrorResult> => {
  const response = await request({
    url: `alert/`,
    method: "get",
  });
  return response;
};

export const updateAlertContent = async (
payload: ManageAlert, fileList?: FileState[]): Promise<SuccessResult<ManageAlert> | ErrorResult> => {
  const formData = new FormData();
  Object.entries({
    ...payload,
  }).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(`${key}`, item);
      });
    } else {
      formData.append(key, value);
    }
  });

  const response = await request({
    url: `alert/`,
    method: "put",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const editHomeContentApi = async (
  payload: HomePageContent
): Promise<SuccessResult<HomePageContent> | ErrorResult> => {
  const formData = new FormData();
  formData.append("bannerCustomColor", payload.bannerCustomColor);
  formData.append("blockCustomColor", payload.blockCustomColor);
  formData.append("companyCustomColor", payload.companyCustomColor);
  formData.append("galleryCustomColor", payload.galleryCustomColor);
  formData.append("oldtips_1", payload.oldtips_1);
  formData.append("oldtips_2", payload.oldtips_2);
  formData.append("oldtips_3", payload.oldtips_3);
  formData.append("oldMailChimpLogo", payload.oldMailChimpLogo);
  formData.append("tips_1", payload.tips[0].image);
  formData.append("tips_url_1", payload.tips[0].url);
  formData.append("tips_2", payload.tips[1].image);
  formData.append("tips_url_2", payload.tips[1].url);

  formData.append("tips_3", payload.tips[2].image);
  formData.append("tips_url_3", payload.tips[2].url);

  formData.append("mailChimpLogo", payload.mailChimpLogo);
  const response = await request({
    url: "/manage_content/home-content",
    method: "put",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const fetchHomeContentApi = async (): Promise<SuccessResult<HomeContent> | ErrorResult> => {
  const response = await request({
    url: "/manage_content/home-content",
    method: "GET",
  });
  return response;
};
//job market
export const EditJobMarketContents = async (
  payload: JobMarketContent
): Promise<SuccessResult<JobMarketContent> | ErrorResult> => {
  const response = await request({
    url: "/manage_content/job-market-content",
    method: "put",
    data: payload,
  });
  return response;
};

export const getAllJobMarketContents = async (): Promise<SuccessResult<JobMarketContent> | ErrorResult> => {
  const response = await request({
    url: "/manage_content/job-market-content",
    method: "get",
  });
  return response;
};
//apply-form-content
export const EditApplyFormContents = async (
  payload: ApplyFormContent
): Promise<SuccessResult<ApplyFormContent> | ErrorResult> => {
  const response = await request({
    url: "/manage_content/apply-form-content",
    method: "put",
    data: payload,
  });
  return response;
};

export const getAllApplyFormContents = async (): Promise<
  SuccessResult<ApplyFormContent> | ErrorResult
> => {
  const response = await request({
    url: "/manage_content/apply-form-content",
    method: "get",
  });
  return response;
};

//company content
export const EditCompanyContents = async (
  payload: CompanyContent
): Promise<SuccessResult<CompanyContent> | ErrorResult> => {
  const formData = new FormData();
  for (const key in payload) {
    // @ts-ignore
    formData.append(key, payload[key]);
  }
  const response = await request({
    url: "/manage_content/company-content",
    method: "put",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const getAllCompanyContents = async (): Promise<
  SuccessResult<CompanyContent> | ErrorResult
> => {
  const response = await request({
    url: "/manage_content/company-content",
    method: "get",
  });
  return response;
};

//Handle Footer Content
export const getFooterContent = async (): // payload: FooterContentType
Promise<SuccessResult<FooterContent> | ErrorResult> => {
  const response = await request({
    url: "/dynamic-footer/footer",
    method: "get",
  });
  return response;
};

//Handle Magazine Contact
export const getMagazineContact = async (): Promise<
  SuccessResult<MagazineContactType> | ErrorResult
> => {
  const response = await request({
    url: "/dynamic-content/contact",
    method: "get",
  });
  return response;
};

//Magazine content update in Magazine page
export const EditMagazineContact = async (
  payload: MagazineContactType
): Promise<SuccessResult<MagazineContactType> | ErrorResult> => {
  const response = await request({
    url: "/dynamic-content/contact",
    method: "post",
    data: payload,
  });
  return response;
};

//Handle Google Map
export const getGoogleMap = async (): Promise<
  SuccessResult<GoogleMapType> | ErrorResult
> => {
  const response = await request({
    url: "/dynamic-map/map-detail",
    method: "get",
  });
  return response;
};

//Google Map update in Magazine page
export const EditGoogleMap = async (
  payload: GoogleMapType
): Promise<SuccessResult<GoogleMapType> | ErrorResult> => {
  const response = await request({
    url: "/dynamic-map/map-detail",
    method: "post",
    data: payload,
  });
  return response;
};

//Handle Contact Model
export const getContactModel = async (): // payload: FooterContentType
Promise<SuccessResult<ContactModelType> | ErrorResult> => {
  const response = await request({
    url: "/dynamic-form-frontend/contact-form",
    method: "get",
  });
  return response;
};

//Contact Model content update
export const EditContactModel = async (
  payload: ContactModelType
): Promise<SuccessResult<ContactModel> | ErrorResult> => {
  const response = await request({
    url: "/dynamic-form-frontend/contact-form",
    method: "post",
    data: payload,
  });
  return response;
};

//Footer content update in Footer page
export const EditFooterContents = async (
  payload: FooterContentType
): Promise<SuccessResult<FooterContent> | ErrorResult> => {
  const response = await request({
    url: "/dynamic-footer/footer",
    method: "put",
    data: payload,
  });
  return response;
};

//side bar content for app
export const EditSideBarContents = async (
  payload: SideBarContent
): Promise<SuccessResult<SideBarContent> | ErrorResult> => {
  const response = await request({
    url: "/manage_content/side-bar-content",
    method: "put",
    data: payload,
  });
  return response;
};

export const getAllSideBarContents = async (): Promise<
  SuccessResult<SideBarContent> | ErrorResult
> => {
  const response = await request({
    url: "/manage_content/side-bar-content",
    method: "get",
  });
  return response;
};

//FAQ content for app
export const EditFAQAccordionContents = async (
  payload: AccordionPayLoadForApi,
  operation: "accordion" | "header" | "cards" | "iconSection"
): Promise<SuccessResult<any> | ErrorResult> => {
  const response = await request({
    url: `/manage_content/faq-content/?operation=${operation}`,
    method: "put",
    data: payload,
  });
  return response;
};

export const EditFAQIconSectionContents = async (
  payload: IconSectionPayLoadForAPi,
  operation: "accordion" | "header" | "cards" | "iconSection"
): Promise<SuccessResult<any> | ErrorResult> => {
  const formData = new FormData();
  for (let item in payload) {
    //@ts-ignore
    formData.append(item, payload[item]);
  }
  const response = await request({
    url: `/manage_content/faq-content/?operation=${operation}`,
    method: "PUT",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const EditFAQHeaderContents = async (
  payload: FaqHeaderPayloadForAPi,
  operation: "accordion" | "header" | "cards" | "iconSection"
): Promise<SuccessResult<any> | ErrorResult> => {
  const formData = new FormData();
  for (let item in payload) {
    //@ts-ignore
    formData.append(item, payload[item]);
  }
  const response = await request({
    url: `/manage_content/faq-content/?operation=${operation}`,
    method: "PUT",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const EditFAQCardsContent = async (
  payload: CardContentI[],
  operation: "accordion" | "header" | "cards" | "iconSection"
): Promise<SuccessResult<any> | ErrorResult> => {
  const formData = new FormData();
  payload.forEach((obj, index) => {
    formData.append(`objects[${index}][title]`, obj.title);
    formData.append(`objects[${index}][link]`, obj.link);
    formData.append(`objects[${index}][_id]`, obj._id);
    formData.append(`objects[${index}][image]`, obj.image);
    if (obj.oldImage) {
      formData.append(`objects[${index}][oldImage]`, obj.oldImage);
    }
  });
  const response = await request({
    url: `/manage_content/faq-content/?operation=${operation}`,
    method: "put",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const getAllFAQContent = async (): Promise<
  SuccessResult<FAQ> | ErrorResult
> => {
  const response = await request({
    url: "/manage_content/faq-content",
    method: "get",
  });
  return response;
};

//about content
export const EditAboutContents = async (
  payload: any,
  operation: keyof HandleUpdateOperationField
): Promise<SuccessResult<any> | ErrorResult> => {
  if (operation === "banner") {
    const formData = new FormData();
    const payloadI = payload as AboutBanner;
    for (let i in payloadI) {
      //@ts-ignore
      formData.append(i, payloadI[i]);
    }
    const response = await request({
      url: `/manage_content/about-content/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
  if (operation === "textBlock") {
    const response = await request({
      url: `/manage_content/about-content/?operation=${operation}`,
      method: "put",
      data: payload,
    });
    return response;
  }
  if (operation === "aboutFeature") {
    const formData = new FormData();
    formData.append(
      "aboutFeaturesHeadingFirst",
      payload.aboutFeaturesHeadingFirst
    );
    formData.append(
      "aboutFeaturesHeadingSecond",
      payload.aboutFeaturesHeadingSecond
    );

    if (payload?.aboutFeaturesImage?.oldImage) {
      formData.append("oldImage", payload?.aboutFeaturesImage?.oldImage);
    }
    if (payload.aboutFeaturesImage)
      formData.append("aboutFeaturesImage", payload.aboutFeaturesImage);
    for (let item of payload.features) {
      formData.append("features", item.text);
    }
    const response = await request({
      url: `/manage_content/about-content/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
  if (operation === "marketing") {
    const response = await request({
      url: `/manage_content/about-content/?operation=${operation}`,
      method: "put",
      data: payload,
    });
    return response;
  }
  if (operation === "youTube") {
    const response = await request({
      url: `/manage_content/about-content/?operation=${operation}`,
      method: "put",
      data: payload,
    });
    return response;
  }
  if (operation === "mediaData") {
    const response = await request({
      url: `/manage_content/about-content/?operation=${operation}`,
      method: "put",
      data: payload,
    });
    return response;
  }
  if (operation === "calender") {
    const formData = new FormData();
    for (let key in payload) {
      formData.append(key, payload[key]);
    }
    const response = await request({
      url: `/manage_content/about-content/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
  if (operation === "offerCard") {
    const formData = new FormData();
    payload.forEach((obj: any, idx: any) => {
      formData.append(`objects[${idx}][_id]`, obj._id);
      formData.append(`objects[${idx}][heading]`, obj.heading);
      formData.append(`objects[${idx}][text]`, obj.text);
      formData.append(`objects[${idx}][image]`, obj.image);
      formData.append(`objects[${idx}][url]`, obj.url);
      if (obj.oldImages) {
        formData.append(`objects[${idx}][oldImages]`, obj.oldImages);
      }
    });
    const response = await request({
      url: `/manage_content/about-content/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
  if (operation === "customer") {
    const formData = new FormData();
    payload.forEach((obj: any, idx: any) => {
      formData.append(`objects[${idx}][_id]`, obj._id);
      if (obj.image) formData.append(`objects[${idx}][image]`, obj.image);
      formData.append(`objects[${idx}][url]`, obj.url);
      if (obj.oldImage) {
        formData.append(`objects[${idx}][oldImages]`, obj.oldImage);
      }
    });
    const response = await request({
      url: `/manage_content/about-content/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
  if (operation === "slider") {
    const formData = new FormData();
    payload.forEach((obj: any, idx: any) => {
      formData.append(`objects[${idx}][_id]`, obj._id);
      if (obj.image) formData.append(`objects[${idx}][image]`, obj.image);
      if (obj.oldImage) {
        formData.append(`objects[${idx}][oldImages]`, obj.oldImage);
      }
    });
    const response = await request({
      url: `/manage_content/about-content/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
  if (operation === "exhibitor") {
    const formData = new FormData();
    payload.forEach((obj: any, idx: any) => {
      formData.append(`objects[${idx}][_id]`, obj._id);
      if (obj.image) formData.append(`objects[${idx}][image]`, obj.image);
      if (obj.oldImage) {
        formData.append(`objects[${idx}][oldImages]`, obj.oldImage);
      }
    });
    const response = await request({
      url: `/manage_content/about-content/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
  if (operation === "careerFair") {
    const formData = new FormData();

    formData.append("careerFairFirstHeading", payload.careerFairFirstHeading);
    formData.append("careerFairSecondHeading", payload.careerFairSecondHeading);
    payload.careerFairCards.forEach((obj: any, idx: any) => {
      formData.append(`objects[${idx}][_id]`, obj._id);
      if (obj.image) formData.append(`objects[${idx}][image]`, obj.image);
      formData.append(`objects[${idx}][heading]`, obj.heading);
      formData.append(`objects[${idx}][text]`, obj.text);
      if (obj.oldImage) {
        formData.append(`objects[${idx}][oldImages]`, obj.oldImage);
      }
    });
    const response = await request({
      url: `/manage_content/about-content/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
  if (operation === "contact") {
    const formData = new FormData();
    formData.append("contactHeadingFirst", payload.contactHeadingFirst);
    formData.append("contactHeadingSecond", payload.contactHeadingSecond);
    payload.contactCard.forEach((obj: any, idx: any) => {
      formData.append(`objects[${idx}][_id]`, obj._id);
      if (obj.image) formData.append(`objects[${idx}][image]`, obj.image);
      formData.append(`objects[${idx}][heading]`, obj.heading);
      formData.append(`objects[${idx}][text]`, obj.text);
      if (obj.oldImage) {
        formData.append(`objects[${idx}][oldImages]`, obj.oldImage);
      }
    });
    const response = await request({
      url: `/manage_content/about-content/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
  if (operation === "twoCards") {
    const formData = new FormData();
    payload.forEach((obj: any, idx: any) => {
      formData.append(`objects[${idx}][_id]`, obj._id);
      formData.append(`objects[${idx}][heading]`, obj.heading);
      if (obj.image) formData.append(`objects[${idx}][image]`, obj.image);
      formData.append(`objects[${idx}][text]`, obj.text);
      formData.append(`objects[${idx}][buttonUrl]`, obj.buttonUrl);
      formData.append(`objects[${idx}][buttonText]`, obj.buttonText);
      formData.append(`objects[${idx}][buttonColor]`, obj.buttonColor);
      if (obj.oldImages) {
        formData.append(`objects[${idx}][oldImages]`, obj.oldImages);
      }
    });
    const response = await request({
      url: `/manage_content/about-content/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
  return await request({});
};

export const getAllAboutContent = async (): Promise<
  SuccessResult<AboutResponseI> | ErrorResult
> => {
  const response = await request({
    url: "/manage_content/about-content",
    method: "get",
  });
  return response;
};

//Magazine order content
export const EditJobMagazineContents = async (
  payload: any,
  operation: keyof MagazineOrderUpdateField
): Promise<SuccessResult<any> | ErrorResult> => {
  if (operation === "header") {
    const response = await request({
      url: `/manage_content/magazine-order/?operation=${operation}`,
      method: "put",
      data: payload,
    });
    return response;
  }
  if (operation === "jobMagazineCard") {
    const { jobMagazineHeading, jobMagazineCards } = payload;
    const formData = new FormData();
    formData.append("jobMagazineHeading", jobMagazineHeading);
    jobMagazineCards.forEach((obj: any, idx: any) => {
      formData.append(`objects[${idx}][_id]`, obj._id);
      if (obj.image) formData.append(`objects[${idx}][image]`, obj.image);
      formData.append(`objects[${idx}][cardHeading]`, obj.cardHeading);
      formData.append(`objects[${idx}][textFirst]`, obj.textFirst);
      formData.append(`objects[${idx}][textSecond]`, obj.textSecond);
      formData.append(`objects[${idx}][additionalText]`, obj.additionalText);
      if (obj.oldImages) {
        formData.append(`objects[${idx}][oldImages]`, obj.oldImages);
      }
    });
    const response = await request({
      url: `/manage_content/magazine-order/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
  if (operation === "jobMagazinePoints") {
    const {
      jobMagazinePointHeading,
      jobMagazinePointSideImage,
      jobMagazinePointText,
      jobMagazinePoints,
      oldImages,
    } = payload;
    const formData = new FormData();
    formData.append("jobMagazinePointHeading", jobMagazinePointHeading);
    formData.append("jobMagazinePointSideImage", jobMagazinePointSideImage);
    formData.append("jobMagazinePointText", jobMagazinePointText);
    if (jobMagazinePointSideImage?.oldImages) {
      formData.append("oldImages", jobMagazinePointSideImage?.oldImages);
    }
    jobMagazinePoints.forEach((point: any) => {
      formData.append("jobMagazinePoints", point.text);
    });

    const response = await request({
      url: `/manage_content/magazine-order/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
  if (operation === "aboutService") {
    const response = await request({
      url: `/manage_content/magazine-order/?operation=${operation}`,
      method: "put",
      data: payload,
    });
    return response;
  }
  return await request({});
};

export const getAllJobMagazineContent = async (): Promise<
  SuccessResult<MagazineOrderResponse> | ErrorResult
> => {
  const response = await request({
    url: "/manage_content/magazine-order",
    method: "get",
  });
  return response;
};

//contact us content
export const getAllContactUsContent = async (): Promise<
  SuccessResult<ContactUResponseType> | ErrorResult
> => {
  const response = await request({
    url: "/manage_content/contact-us",
    method: "get",
  });
  return response;
};

export const EditContactUsContact = async (
  payload: any,
  operation: keyof ContactUsUpdateField
): Promise<SuccessResult<any> | ErrorResult> => {
  if (operation === "pageHeading") {
    const response = await request({
      url: `/manage_content/contact-us/?operation=${operation}`,
      method: "put",
      data: payload,
    });
    return response;
  }
  if (operation === "contactForm") {
    const response = await request({
      url: `/manage_content/contact-us/?operation=${operation}`,
      method: "put",
      data: payload,
    });
    return response;
  }
  if (operation === "addressSection") {
    const response = await request({
      url: `/manage_content/contact-us/?operation=${operation}`,
      method: "put",
      data: payload,
    });
    return response;
  }
  if (operation === "aboutUs") {
    const { sideImage, ...restData } = payload;
    const formData = new FormData();
    if (sideImage) formData.append("sideImage", sideImage);
    for (let item in restData) {
      formData.append(item, restData[item]);
    }
    const response = await request({
      url: `/manage_content/contact-us/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
  if (operation === "counter") {
    const response = await request({
      url: `/manage_content/contact-us/?operation=${operation}`,
      method: "put",
      data: payload,
    });
    return response;
  }
  if (operation === "contactCardFirstWithPoints") {
    const { image, ...restData } = payload;
    const formData = new FormData();
    if (image) formData.append("image", image);
    for (let item in restData) {
      formData.append(item, restData[item]);
    }
    const response = await request({
      url: `/manage_content/contact-us/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
  if (operation === "ContactCardSecond") {
    const { image, ...restData } = payload;
    const formData = new FormData();
    if (image) formData.append("image", image);
    for (let item in restData) {
      formData.append(item, restData[item]);
    }
    const response = await request({
      url: `/manage_content/contact-us/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
  if (operation === "aboutTeam") {
    const formData = new FormData();
    const { aboutTeamHeading, aboutTeamSubHeading, aboutTeamCard } = payload;
    formData.append("aboutTeamHeading", aboutTeamHeading);
    formData.append("aboutTeamSubHeading", aboutTeamSubHeading);
    aboutTeamCard.forEach((obj: any, idx: any) => {
      formData.append(`objects[${idx}][_id]`, obj._id);
      if (obj.image) formData.append(`objects[${idx}][image]`, obj.image);
      formData.append(`objects[${idx}][heading]`, obj.heading);
      formData.append(`objects[${idx}][subHeading]`, obj.subHeading);
      formData.append(`objects[${idx}][buttonText]`, obj.buttonText);
      formData.append(`objects[${idx}][buttonUrl]`, obj.buttonUrl);
      formData.append(`objects[${idx}][buttonColor]`, obj.buttonColor);
      if(obj.oldImages){
        formData.append(`objects[${idx}][oldImages]`, obj.oldImages);
      }
    });
    const response = await request({
      url: `/manage_content/contact-us/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
  return await request({});
};

// job wall content
export const getAllJobWallContent = async (): Promise<
  SuccessResult<JobWallContent> | ErrorResult
> => {
  const response = await request({
    url: "/manage_content/job-wall",
    method: "get",
  });
  return response;
};

export const EditJobWallContent = async (
  payload: any,
  operation: keyof JobWallUpdateField
): Promise<SuccessResult<any> | ErrorResult> => {
  if (operation === "banner") {
    const { image, ...restData } = payload;
    const formData = new FormData();
    if (image) formData.append("image", image);
    for (let item in restData) {
      formData.append(item, restData[item]);
    }
    const response = await request({
      url: `/manage_content/job-wall/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
  if (operation === "industryIcon") {
    const formData = new FormData();
    const { industryIcon,ioldImage } = payload;
    if(ioldImage){
      formData.append("ioldImage", ioldImage);
    }
    if (industryIcon) formData.append("industryIcon", industryIcon);
    const response = await request({
      url: `/manage_content/job-wall/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }

  if (operation === "locationIcon") {
    const formData = new FormData();
    const { locationIcon,loldImage } = payload;
    if (locationIcon) formData.append("locationIcon", locationIcon);
    if (loldImage) formData.append("loldImage", loldImage);
    const response = await request({
      url: `/manage_content/job-wall/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }

  if (operation === "contactPersonIcon") {
    const formData = new FormData();
    const { contactPersonIcon,coldImage } = payload;
    if(coldImage){
      formData.append("coldImage", coldImage);
    }
    if (contactPersonIcon)
      formData.append("contactPersonIcon", contactPersonIcon);
    const response = await request({
      url: `/manage_content/job-wall/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }

  return await request({});
};

//Magazine order content
export const EditHomePageV2Contents = async (
  payload: any,
  operation: keyof HomePageOperationField
): Promise<SuccessResult<any> | ErrorResult> => {
  if (operation === "cardSection") {
    const { cardHeading, cardText, CardBackgroundColor, cards } = payload;
    const formData = new FormData();
    formData.append("cardHeading", cardHeading);
    formData.append("cardText", cardText);
    formData.append("CardBackgroundColor", CardBackgroundColor);
    cards.forEach((obj: any, idx: any) => {
      formData.append(`objects[${idx}][_id]`, obj._id);
      if (obj.image) formData.append(`objects[${idx}][image]`, obj.image);
      formData.append(`objects[${idx}][link]`, obj.link);
      if(obj.oldImages){
        formData.append(`objects[${idx}][oldImages]`, obj.oldImages);
      }
    });
    const response = await request({
      url: `/manage_content/home-page-v2/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
  if (operation === "youtubeSection") {
    const response = await request({
      url: `/manage_content/home-page-v2/?operation=${operation}`,
      method: "put",
      data: payload,
    });
    return response;
  }
  if (operation === "searchBar") {
    const response = await request({
      url: `/manage_content/home-page-v2/?operation=${operation}`,
      method: "put",
      data: payload,
    });
    return response;
  }
  if (operation === "topState") {
    const response = await request({
      url: `/manage_content/home-page-v2/?operation=${operation}`,
      method: "put",
      data: payload,
    });
    return response;
  }
  if (operation === "federalState") {
    const response = await request({
      url: `/manage_content/home-page-v2/?operation=${operation}`,
      method: "put",
      data: payload,
    });
    return response;
  }
  if (operation === "gallery") {
    const response = await request({
      url: `/manage_content/home-page-v2/?operation=${operation}`,
      method: "put",
      data: payload,
    });
    return response;
  }
  if (operation === "textContainer") {
    const formData = new FormData();
    for (let item in payload) {
      if (payload[item]) formData.append(item, payload[item]);
    }

    const response = await request({
      url: `/manage_content/home-page-v2/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  }
  if (operation === "emailSection") {
    const formData = new FormData();
    for (let item in payload) {
      if (payload[item]) formData.append(item, payload[item]);
    }

    const response = await request({
      url: `/manage_content/home-page-v2/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  }
  if (operation === "companiesLogo") {
    const response = await request({
      url: `/manage_content/home-page-v2/?operation=${operation}`,
      method: "put",
      data: payload,
    });
    return response;
  }
  if (operation === "headerLogoSideImage") {
    const formData = new FormData();
    for (let item in payload) {
      if (payload[item]) formData.append(item, payload[item]);
    }

    const response = await request({
      url: `/manage_content/home-page-v2/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  }
  if (operation === "adminLogo") {
    const formData = new FormData();
    for (let item in payload) {
      if (payload[item]) formData.append(item, payload[item]);
    }

    const response = await request({
      url: `/manage_content/home-page-v2/?operation=${operation}`,
      method: "put",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  }
  if (operation === "welcomeMessageForApp") {
    const response = await request({
      url: `/manage_content/home-page-v2/?operation=${operation}`,
      method: "put",
      data: payload,
    });
    return response;
  }

  return await request({});
};

export const getAllHomePageV2Content = async (): Promise<
  SuccessResult<HomePage> | ErrorResult
> => {
  const response = await request({
    url: "/manage_content/home-page-v2",
    method: "get",
  });
  return response;
};

// email content
export const editEmailContents = async (
  payload: any,
  operation: keyof EmailContent
): Promise<SuccessResult<any> | ErrorResult> => {
  if (operation === "application") {
    const response = await request({
      url: `/manage_content/email-content/?operation=${operation}`,
      method: "put",
      data: payload,
    });
    return response;
  }
  if (operation === "appointment") {
    const response = await request({
      url: `/manage_content/email-content/?operation=${operation}`,
      method: "put",
      data: payload,
    });
    return response;
  }

  return await request({});
};

export const getAllEmailContent = async (): Promise<
  SuccessResult<EmailContent> | ErrorResult
> => {
  const response = await request({
    url: "/manage_content/email-content",
    method: "get",
  });
  return response;
};

export const getAllTabs = async (): Promise<
  SuccessResult<any> | ErrorResult
> => {
  const response = await request({
    url: "/navbar/tabs",
    method: "get",
  });
  return response;
};

export const updateTabs = async (
  data: any
): Promise<SuccessResult<any> | ErrorResult> => {
  const response = await request({
    url: "/navbar/tabs",
    method: "put",
    data,
  });
  return response;
};
