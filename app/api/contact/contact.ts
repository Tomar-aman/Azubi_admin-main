import { request } from "../api";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { transformContacts } from "./helper";
import {
  TransformContact,
  TransformContactForFilters,
  GetAllContactsType,
} from "./contact.types";
import urlcat from "urlcat";

export const getContacts = async (): Promise<
  SuccessResult<TransformContact[]> | ErrorResult
> => {
  const response = await request({
    url: "/contacts/",
    method: "get",
  });
  if (response.remote === "success") {
    response.data.data = transformContacts(response.data.data);
    return response;
  }
  return response;
};

export const getContactsByFilter = async (
  payload: GetAllContactsType
): Promise<SuccessResult<TransformContactForFilters> | ErrorResult> => {
  const { searchValue, pageNo, recordPerPage } = payload;
  const url = urlcat("/contacts/get_all_contacts_by_filter", {
    searchValue,
    pageNo,
    recordPerPage,
  });

  const response = await request({
    url,
    method: "get",
  });
  if (response.remote === "success") {
    response.data.data.data = transformContacts(response.data.data.data);
    response.data.data.data.count = response.data.data.data.count;
    return response;
  }

  return response;
};

export const addContact = async (
  contactData: TransformContact
): Promise<SuccessResult<TransformContact> | ErrorResult> => {
  const response = await request({
    url: "/contacts/",
    method: "post",
    data: contactData,
  });
  return response;
};

export const editContact = async (
  contactData: TransformContact
): Promise<SuccessResult<TransformContact> | ErrorResult> => {
  const response = await request({
    url: "/contacts/",
    method: "put",
    data: contactData,
  });
  return response;
};

export const deleteContact = async (
  id: string
): Promise<SuccessResult<TransformContact> | ErrorResult> => {
  const response = await request({
    url: `/contacts/${id}`,
    method: "delete",
  });
  return response;
};
