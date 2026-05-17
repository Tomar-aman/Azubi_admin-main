const withProtocol = (domain: string) => {
  if (/^https?:\/\//i.test(domain)) {
    return domain;
  }

  return `https://${domain}`;
};

export const buildManagedLoginUrl = (domain: string, email: string) => {
  const url = new URL(withProtocol(domain));
  url.searchParams.set("email", email);
  return url.toString();
};

export const getCompanyLoginUrl = (email: string) => {
  return buildManagedLoginUrl(
    process.env.NEXT_PUBLIC_MANAGED_USER_DOMAIN || "kundenzugang",
    email
  );
};

export const getEmployeeLoginUrl = (email: string) => {
  return buildManagedLoginUrl(
    process.env.NEXT_PUBLIC_MANAGED_EMPLOYEE_DOMAIN || "wohnzugang",
    email
  );
};
