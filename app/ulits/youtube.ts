export const getYoutubeEmbedUrl = (url: string) => {
  if (!url) return "";
  
  // Handle already embed URLs
  if (url.includes("/embed/")) return url;

  // Handle standard watch URLs
  let videoId = "";
  if (url.includes("v=")) {
    videoId = url.split("v=")[1].split("&")[0];
  } 
  // Handle shortened youtu.be URLs
  else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};
