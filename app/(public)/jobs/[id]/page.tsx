"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Divider,
  Paper,
  Skeleton,
  Stack,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Apartment as ApartmentIcon,
  Email as EmailIcon,
  Language as WebIcon,
  Phone as PhoneIcon,
  InsertDriveFile as FileIcon,
  Download as DownloadIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import { getJobDetailById } from "@/app/api/jobs/jobs";
import { getYoutubeEmbedUrl } from "@/app/ulits/youtube";

const TEAL = "#1FA49A";
const NAVY = "#1a2b3c";

const getImageUrl = (filepath: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL || "";
  return `${baseUrl.replace(/\/$/, "")}/${filepath.replace(/^\//, "")}`;
};

export default function JobDetailPage() {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // Only logged-in admins see the Edit button (public visitors don't).
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const checkLogin = () =>
      setIsLoggedIn(!!localStorage.getItem("x-access"));
    checkLogin();
    // Keep in sync when the user logs out/in from another tab (storage event
    // fires cross-tab), and re-check when this tab regains focus.
    window.addEventListener("storage", checkLogin);
    window.addEventListener("focus", checkLogin);
    return () => {
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("focus", checkLogin);
    };
  }, []);

  useEffect(() => {
    const fetchJobDetail = async () => {
      setLoading(true);
      const response = await getJobDetailById(id);
      if (response.remote === "success") {
        setJob(response.data.data);
      }
      setLoading(false);
    };

    if (id) {
      fetchJobDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#F5F7F9" }}>
        <Box sx={{ bgcolor: TEAL, height: 56 }} />
        <Box sx={{ px: { xs: 2, md: 6 }, py: 4, maxWidth: "1200px", mx: "auto" }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Skeleton variant="rectangular" height={500} sx={{ borderRadius: "16px" }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={350} sx={{ borderRadius: "16px" }} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }

  if (!job) return null;

  const jobImages = Array.isArray(job.jobImages) ? job.jobImages : [];
  // Company gallery images (backend returns them nested under `companyImages`).
  const companyImages = Array.isArray(job.companyImages)
    ? job.companyImages
      .map((it: any) => it?.companyImages || it)
      .filter((it: any) => it?.filepath)
    : [];
  const companyName = job.company?.companyName || "—";
  const companyLogo = job.company?.companyLogo ? getImageUrl(job.company.companyLogo) : "";
  // Show ALL industries saved on the job (fall back to legacy single).
  const industriesList =
    Array.isArray(job.industries) && job.industries.length
      ? job.industries.map((i: any) => i?.industryName).filter(Boolean)
      : job.industryName?.industryName
        ? [job.industryName.industryName]
        : [];
  const industry = industriesList.join(", ");

  // Show ALL job types saved on the job (fall back to legacy single).
  const jobTypesList =
    Array.isArray(job.jobTypes) && job.jobTypes.length
      ? job.jobTypes.map((t: any) => t?.jobTypeName).filter(Boolean)
      : job.jobType?.jobTypeName
        ? [job.jobType.jobTypeName]
        : [];
  const employmentType = jobTypesList.join(", ");

  // One tag per job type
  const employmentTags = jobTypesList;

  // Location: address only (zip code and cities hidden on request)
  const locationText = job.address || "N/A";

  const videoUrl = Array.isArray(job.videoLink) && job.videoLink[0] ? job.videoLink[0] : null;

  const documents = Array.isArray(job.attachments)
    ? job.attachments.filter((a: any) => a?.document?.filepath)
    : [];

  // Turn whatever Google Maps URL was pasted on the job into something that
  // actually renders inside an iframe. A plain share/place link can't be
  // embedded, so we extract coordinates or a place/query and rebuild a
  // key-less embeddable URL, falling back to the address when we can't parse it.
  const buildEmbedSrc = (url: string, fallbackQuery: string): string => {
    const addressEmbed = fallbackQuery
      ? `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&z=15&output=embed`
      : "";
    if (!url) return addressEmbed;
    if (/\/maps\/embed/.test(url) || /output=embed/.test(url)) return url;
    const coord =
      url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
      url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) ||
      url.match(/[?&](?:q|ll|sll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coord) {
      return `https://maps.google.com/maps?q=${coord[1]},${coord[2]}&z=15&output=embed`;
    }
    const place = url.match(/\/place\/([^/@]+)/);
    if (place) {
      const q = decodeURIComponent(place[1].replace(/\+/g, " "));
      return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;
    }
    const q = url.match(/[?&]q=([^&]+)/);
    if (q) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(
        decodeURIComponent(q[1]),
      )}&z=15&output=embed`;
    }
    // Unparseable (e.g. a maps.app.goo.gl short link) — use the address instead.
    return addressEmbed;
  };

  const isEmbedCode =
    typeof job.embeddedCode === "string" && job.embeddedCode.includes("<iframe");
  const addressForMap = locationText !== "N/A" ? locationText : companyName;
  const mapSrc = job.mapUrl
    ? buildEmbedSrc(job.mapUrl, addressForMap)
    : "";
  const mapLink = job.mapUrl || "";
  const showMap = isEmbedCode || Boolean(mapSrc);

  // Sidebar contact rows (clickable)
  const withProtocol = (url: string) =>
    /^https?:\/\//i.test(url) ? url : `https://${url}`;
  const websiteVal = job.website || job.company?.website;
  const phoneVal = job.phoneNumber || job.company?.phoneNo;
  const contactRows = [
    {
      label: "EMAIL",
      value: job.email,
      href: job.email ? `mailto:${job.email}` : undefined,
      icon: <EmailIcon sx={{ fontSize: 18 }} />,
    },
    {
      label: "WEBSITE",
      value: websiteVal,
      href: websiteVal ? withProtocol(websiteVal) : undefined,
      icon: <WebIcon sx={{ fontSize: 18 }} />,
    },
    {
      label: "PHONE",
      value: phoneVal,
      href: phoneVal ? `tel:${String(phoneVal).replace(/\s/g, "")}` : undefined,
      icon: <PhoneIcon sx={{ fontSize: 18 }} />,
    },
    {
      label: "ADDITIONAL EMAIL",
      value: job.additionalEmail,
      href: job.additionalEmail ? `mailto:${job.additionalEmail}` : undefined,
      icon: <EmailIcon sx={{ fontSize: 18 }} />,
    },
  ].filter((r) => r.value);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F5F7F9" }}>
      {/* Header Bar */}
      <Box
        sx={{
          bgcolor: TEAL,
          py: 1.5,
          px: { xs: 2, md: 6 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={() => router.push("/jobs")}
          startIcon={<ArrowBackIcon />}
          sx={{
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "14px",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          }}
        >
          Back To Jobs
        </Button>
        {/* Edit button — only visible to logged-in admins */}
        {isLoggedIn && (
          <Button
            onClick={() => {
              // Re-check at click time — the token may have been cleared in
              // another tab since this page loaded.
              if (!localStorage.getItem("x-access")) {
                setIsLoggedIn(false);
                return;
              }
              window.open(`/manage-jobs/add?id=${id}`, "_blank");
            }}
            startIcon={<EditIcon />}
            variant="outlined"
            sx={{
              color: "#fff",
              borderColor: "rgba(255,255,255,0.7)",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "14px",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.15)",
                borderColor: "#fff",
              },
            }}
          >
            Edit
          </Button>
        )}
      </Box>

      {/* Page Body */}
      <Box sx={{ px: { xs: 2, md: 6 }, py: 4, maxWidth: "1200px", mx: "auto" }}>
        <Grid container spacing={4}>

          {/* Left Column — Main Card */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: "16px" }}>

              {/* Employment type tags (teal text, comma-separated) */}
              {employmentTags.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.5 }}>
                  {employmentTags.map((tag: string, idx: number) => (
                    <Typography
                      key={tag}
                      sx={{ color: TEAL, fontWeight: 600, fontSize: "13px" }}
                    >
                      {tag}{idx < employmentTags.length - 1 ? "," : ""}
                    </Typography>
                  ))}
                </Box>
              )}

              {/* Job Title */}
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, color: NAVY, mb: 2, lineHeight: 1.2 }}
              >
                {job.jobTitle}
              </Typography>

              {/* Company row: logo + name */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                {/* Logo box */}
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: "12px",
                    border: "1px solid #e8eef2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    bgcolor: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {companyLogo ? (
                    <Box
                      component="img"
                      src={companyLogo}
                      alt={companyName}
                      sx={{ width: "80%", height: "80%", objectFit: "contain" }}
                    />
                  ) : (
                    <ApartmentIcon sx={{ fontSize: 32, color: "#bbb" }} />
                  )}
                </Box>

                {/* Company name */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    color: TEAL,
                    cursor: job.company?._id ? "pointer" : "default",
                  }}
                  onClick={() =>
                    job.company?._id && router.push(`/companies/${job.company._id}`)
                  }
                >
                  <ApartmentIcon sx={{ fontSize: 17 }} />
                  <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>
                    {companyName}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Location */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                  <LocationIcon sx={{ color: TEAL, mt: "2px", fontSize: 20 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ color: "#8a97a3", fontSize: "12px", fontWeight: 700, mb: 0.25 }}>
                      Location
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: NAVY, fontSize: "14px" }}>
                      {locationText}
                    </Typography>
                  </Box>
                  {mapLink && (
                    <Button
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      endIcon={<OpenInNewIcon sx={{ fontSize: "14px !important" }} />}
                      size="small"
                      sx={{
                        color: TEAL,
                        fontWeight: 700,
                        textTransform: "none",
                        fontSize: "13px",
                        flexShrink: 0,
                        "&:hover": { bgcolor: "transparent" },
                      }}
                    >
                      Open in Maps
                    </Button>
                  )}
                </Box>

                {/* Map */}
                {showMap &&
                  (isEmbedCode ? (
                    <Box
                      sx={{
                        mt: 2,
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: "1px solid #eef2f4",
                        "& iframe": { width: "100%", height: 220, border: 0, display: "block" },
                      }}
                      dangerouslySetInnerHTML={{ __html: job.embeddedCode }}
                    />
                  ) : (
                    <Box
                      sx={{
                        mt: 2,
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: "1px solid #eef2f4",
                        height: 220,
                      }}
                    >
                      <iframe
                        src={mapSrc}
                        title="Location map"
                        loading="lazy"
                        style={{ width: "100%", height: "100%", border: 0, display: "block" }}
                      />
                    </Box>
                  ))}
              </Box>

              {/* Job Images */}
              {jobImages.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Grid container spacing={2}>
                    {jobImages.map((image: any) => (
                      <Grid
                        item
                        xs={12}
                        sm={jobImages.length === 1 ? 12 : 6}
                        key={image._id}
                      >
                        <Box
                          component="img"
                          src={getImageUrl(image.filepath)}
                          alt={job.jobTitle}
                          sx={{
                            width: "100%",
                            aspectRatio: "16 / 10",
                            objectFit: "cover",
                            borderRadius: "12px",
                            border: "1px solid #eef2f4",
                            display: "block",
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Company Gallery */}
              {companyImages.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: "16px", color: NAVY, mb: 2 }}>
                    Company Gallery
                  </Typography>
                  <Grid container spacing={2}>
                    {companyImages.map((image: any) => (
                      <Grid item xs={6} sm={3} key={image._id}>
                        <Box
                          component="img"
                          src={getImageUrl(image.filepath)}
                          alt={companyName}
                          sx={{
                            width: "100%",
                            aspectRatio: "1 / 1",
                            objectFit: "cover",
                            borderRadius: "12px",
                            border: "1px solid #eef2f4",
                            display: "block",
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Description */}
              <Typography sx={{ fontWeight: 800, fontSize: "16px", color: NAVY, mb: 2 }}>
                Beschreibung
              </Typography>
              <Box
                sx={{
                  color: "#4a4a4a",
                  lineHeight: 1.9,
                  fontSize: "14px",
                  "& h2, & h3, & h4, & strong": { color: NAVY, fontWeight: 700 },
                  "& ul": { pl: 2.5, mb: 2 },
                  "& li": { mb: 0.75 },
                  "& p": { mb: 1.5 },
                  "& a": { color: TEAL },
                }}
                dangerouslySetInnerHTML={{
                  __html: job.jobDescription || "No description provided.",
                }}
              />

              {/* Documents */}
              {documents.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: "16px", color: NAVY, mb: 2 }}>
                    Documents
                  </Typography>
                  <Stack spacing={1.5}>
                    {documents.map((att: any) => (
                      <Box
                        key={att._id}
                        component="a"
                        href={getImageUrl(att.document.filepath)}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.5,
                          borderRadius: "10px",
                          border: "1px solid #eef2f4",
                          bgcolor: "#f7fafb",
                          textDecoration: "none",
                          color: NAVY,
                          transition: "all 0.2s",
                          "&:hover": { borderColor: TEAL, bgcolor: "rgba(31,164,154,0.06)" },
                        }}
                      >
                        <FileIcon sx={{ color: TEAL }} />
                        <Typography sx={{ fontWeight: 600, flexGrow: 1, wordBreak: "break-word", fontSize: "14px" }}>
                          {att.document.fileName || "Document"}
                        </Typography>
                        <DownloadIcon sx={{ color: "#8a97a3" }} />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Video */}
              {videoUrl && (
                <Box sx={{ mt: 4 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: "16px", color: NAVY, mb: 2 }}>
                    Company Video
                  </Typography>
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: "12px",
                      overflow: "hidden",
                      pt: "56.25%",
                    }}
                  >
                    <iframe
                      src={getYoutubeEmbedUrl(videoUrl)}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: 0,
                      }}
                      allowFullScreen
                    />
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right Column — Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: "16px" }}>
              <Stack spacing={3}>

                {/* Job Overview */}
                <Box>
                  <Typography sx={{ fontWeight: 800, color: NAVY, mb: 2, fontSize: "14px" }}>
                    Job Overview
                  </Typography>
                  <Stack spacing={2}>
                    {employmentType && (
                      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                        <Typography sx={{ color: "#8a97a3", fontSize: "12px", fontWeight: 600, flexShrink: 0 }}>
                          Employment Type
                        </Typography>
                        <Typography sx={{ color: NAVY, fontWeight: 700, fontSize: "12px", textAlign: "right" }}>
                          {employmentType}
                        </Typography>
                      </Box>
                    )}
                    {industry && (
                      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                        <Typography sx={{ color: "#8a97a3", fontSize: "12px", fontWeight: 600, flexShrink: 0 }}>
                          Industry
                        </Typography>
                        <Typography sx={{ color: NAVY, fontWeight: 700, fontSize: "12px", textAlign: "right" }}>
                          {industry}
                        </Typography>
                      </Box>
                    )}
                    {job.beginning?.beginningName && (
                      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                        <Typography sx={{ color: "#8a97a3", fontSize: "12px", fontWeight: 600, flexShrink: 0 }}>
                          Start
                        </Typography>
                        <Typography sx={{ color: NAVY, fontWeight: 700, fontSize: "12px", textAlign: "right" }}>
                          {job.beginning.beginningName}
                        </Typography>
                      </Box>
                    )}
                    {job.regionDetail?.name && (
                      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                        <Typography sx={{ color: "#8a97a3", fontSize: "12px", fontWeight: 600, flexShrink: 0 }}>
                          Region
                        </Typography>
                        <Typography sx={{ color: NAVY, fontWeight: 700, fontSize: "12px", textAlign: "right" }}>
                          {job.regionDetail.name}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>

                <Divider />

                {/* Contact Information */}
                {contactRows.length > 0 && (
                  <Box>
                    <Typography sx={{ fontWeight: 800, color: NAVY, mb: 2, fontSize: "14px" }}>
                      Contact Information
                    </Typography>
                    <Stack spacing={2.5}>
                      {contactRows.map((row) => (
                        <Box key={row.label} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                          <Box
                            sx={{
                              bgcolor: "#e6f3f3",
                              p: 0.75,
                              borderRadius: "6px",
                              display: "flex",
                              color: TEAL,
                              flexShrink: 0,
                            }}
                          >
                            {row.icon}
                          </Box>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{
                                color: "#8a97a3",
                                fontSize: "10px",
                                fontWeight: 700,
                                letterSpacing: "0.5px",
                                mb: 0.25,
                              }}
                            >
                              {row.label}
                            </Typography>
                            {row.href ? (
                              <Box
                                component="a"
                                href={row.href}
                                {...(row.label === "WEBSITE"
                                  ? { target: "_blank", rel: "noreferrer" }
                                  : {})}
                                sx={{
                                  color: TEAL,
                                  fontWeight: 600,
                                  fontSize: "13px",
                                  wordBreak: "break-word",
                                  textDecoration: "none",
                                  display: "block",
                                  "&:hover": { textDecoration: "underline" },
                                }}
                              >
                                {row.value}
                              </Box>
                            ) : (
                              <Typography
                                sx={{
                                  color: NAVY,
                                  fontWeight: 600,
                                  fontSize: "13px",
                                  wordBreak: "break-word",
                                }}
                              >
                                {row.value}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* View Company Profile Button */}
                {job.company?._id && (
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => router.push(`/companies/${job.company._id}`)}
                    sx={{
                      color: TEAL,
                      borderColor: TEAL,
                      borderRadius: "10px",
                      py: 1.2,
                      fontWeight: 700,
                      textTransform: "none",
                      fontSize: "14px",
                      "&:hover": { borderColor: TEAL, bgcolor: "rgba(31,164,154,0.06)" },
                    }}
                  >
                    View Company Profile
                  </Button>
                )}
              </Stack>
            </Paper>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
}
