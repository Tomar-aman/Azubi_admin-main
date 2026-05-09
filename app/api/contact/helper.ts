import { Contact, TransformContact } from "./contact.types";

export const transformContacts = (contacts: Contact[]): TransformContact[] => {
  return contacts.map((contact) => ({
    id: contact._id,
    name: contact.name,
    phoneNumber: contact.phoneNumber,
    email: contact.email,
    message: contact.message,
  }));
};
