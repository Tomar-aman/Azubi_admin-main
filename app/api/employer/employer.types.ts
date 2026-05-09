import { IconWithContent } from "@/app/(user)/manage-employers";

export interface Employer {
  industryName: string;
  contactPerson: string;
  jobTitle: string;
  companyName: string;
  email: string;
  website: string;
  phoneNo: string;
  address: string;
  zipCode: string;
  companyLogo: string;
  companyDescription: string;
  city: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}
export type industriesType = {
  _id: string;
};
export type CityTypeForGetDetail = {
  _id: string;
};
export type EmployerWithIndustriesTypeAndId = {
  industryName: { id: string; label: string };
  id: string;
  date: string;
  companyName: string;
  email: string;
  contactPerson: string;
  city: { id: string; label: string };
  status: string;
  createdAt: string;
  jobTitle: string;
  website: string;
  mapUrl?: string;
  address: string;
  zipCode: string;
  companyDescription: string;
  phoneNo: string;
  videoLink: string[];
  additionalData?: IconWithContent[];
  companyLogo: { _id: string } | any;
  companyImages?: any;
  removedFile?: any;
};
export interface EmployerFormType {
  industryName: { id: string; label: string };
  contactPerson: string;
  jobTitle: string;
  companyName: string;
  email: string;
  website: string;
  mapUrl?: string;
  phoneNo: string;
  address: string;
  zipCode: string;
  city: { id: string; label: string };
  companyLogo: File | null;
  videoLink: string[];
  companyDescription: string;
  companyImages?: any;
  removedFile?: any;
  locationUrl: string;
  oldCompanyLogo: string;
  oldCompanyImages: string[];
}

export interface BannerFormType {
  companyName: { id: string; label: string };
  city: { id: string; label: string };
  industryName: { id: string; label: string };
  typesOfJobs: {id: string; label: string};
  bannerTitle: string;
  jobUrl: string;
  job: { id: string; label: string };
  images?: File[];
  removeFile?: string[];
  embeddedCode?: string;
}
