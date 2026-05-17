import { getAllHomePageV2Content } from "./manageContent";

const DEFAULT_ADMIN_LOGO = "/logo.png";

export const getManagedAdminLogoUrl = async () => {
  const response = await getAllHomePageV2Content();
  if (response.remote !== "success") {
    return DEFAULT_ADMIN_LOGO;
  }

  const filepath = response.data.data?.adminLogo?.filepath;
  if (!filepath) {
    return DEFAULT_ADMIN_LOGO;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL || "";
  return `${baseUrl.replace(/\/$/, "")}/${filepath.replace(/^\//, "")}`;
};
