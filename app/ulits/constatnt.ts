export const handleDynamicFileSelected = (id: string) => {
  const element = document.getElementById(id);
  console.log({ element, id });
  if (element) {
    element.click();
  }
};
export const handleDynamicSetSrc = (id: string, value: string) => {
  const element: any = document.getElementById(id);
  if (element) {
    element.value = value;
  }
};

export const handleFindImage = (mediaUrls: any[], id: string) => {
  const imageUrl = mediaUrls.find((item) => {
    return item._id === id;
  });
  return process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL + imageUrl.filepath;
};
export const handleFindImageAndReturnId = (mediaUrls: any[], url: string) => {
  const imageUrl = mediaUrls.find((item) => {
    return item.filepath === url;
  });
  return imageUrl._id;
};
