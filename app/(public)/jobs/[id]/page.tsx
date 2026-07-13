"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  Paper,
  Skeleton,
  Stack,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Apartment as ApartmentIcon,
  Email as EmailIcon,
  InsertDriveFile as FileIcon,
  Download as DownloadIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import { getJobDetailById } from "@/app/api/jobs/jobs";
import { getYoutubeEmbedUrl } from "@/app/ulits/youtube";

const TEAL = "#0097A7";
const TEAL_DARK = "#00808e";
const HERO_GRADIENT = "linear-gradient(115deg, #10a5a2 0%, #077885 100%)";
const NAVY = "#1a2b3c";

const getImageUrl = (filepath: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL || "";
  return `${baseUrl.replace(/\/$/, "")}/${filepath.replace(/^\//, "")}`;
};

export default function JobDetailPage() {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

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

  const fullBleed = {
    mt: { xs: -2, md: -4 },
    mx: { xs: -2, md: -4 },
    mb: { xs: -2, md: -4 },
  };

  if (loading) {
    return (
      <Box sx={{ ...fullBleed, bgcolor: "#f4f6f8", minHeight: "100%" }}>
        <Box sx={{ background: HERO_GRADIENT, height: 220 }} />
        <Box sx={{ px: { xs: 2, md: 6 }, mt: { xs: -8, md: -12 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Skeleton variant="rectangular" height={420} sx={{ borderRadius: "24px" }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: "24px" }} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }

  if (!job) return null;

  const jobImages = Array.isArray(job.jobImages) ? job.jobImages : [];

  const companyName = job.company?.companyName || "—";
  const companyLogo = job.company?.companyLogo
    ? getImageUrl(job.company.companyLogo)
    : "";
  const industry = job.industryName?.industryName || "";
  const employmentType = job.jobType?.jobTypeName || "";
  const cityNames = Array.isArray(job.cityDetail)
    ? job.cityDetail.map((c: any) => c?.name).filter(Boolean).join(", ")
    : "";
  const locationText =
    [job.address, [job.zipCode, cityNames].filter(Boolean).join(" ")]
      .filter(Boolean)
      .join(", ") || "N/A";

  const videoUrl =
    Array.isArray(job.videoLink) && job.videoLink[0] ? job.videoLink[0] : null;

  const documents = Array.isArray(job.attachments)
    ? job.attachments.filter((a: any) => a?.document?.filepath)
    : [];

  // Map: prefer an embedded iframe code, then a genuinely embeddable map url,
  // else build a key-less Google Maps embed from the resolved address (share
  // links like maps.app.goo.gl can't be iframed, so they fall back to this).
  const isEmbedCode =
    typeof job.embeddedCode === "string" && job.embeddedCode.includes("<iframe");
  const mapLink = job.locationUrl || job.mapUrl || "";
  const isEmbeddableUrl =
    typeof job.mapUrl === "string" &&
    /(output=embed|\/maps\/embed|\/embed)/.test(job.mapUrl);
  const mapSrc = isEmbeddableUrl
    ? job.mapUrl
    : `https://maps.google.com/maps?q=${encodeURIComponent(
        locationText !== "N/A" ? locationText : companyName,
      )}&z=15&output=embed`;
  const showMap = isEmbedCode || locationText !== "N/A" || isEmbeddableUrl;

  const overviewRows = [
    { label: "Employment Type", value: employmentType },
    { label: "Industry", value: industry },
    { label: "Start", value: job.beginning?.beginningName },
    { label: "Region", value: job.regionDetail?.name },
    { label: "Posted", value: new Date(job.createdAt).toLocaleDateString() },
  ].filter((r) => r.value);

  const contactRows = [
    { label: "Email", value: job.email, icon: <EmailIcon sx={{ color: TEAL }} /> },
    {
      label: "Additional Email",
      value: job.additionalEmail,
      icon: <EmailIcon sx={{ color: TEAL }} />,
    },
  ].filter((r) => r.value);

  return (
    <Box sx={{ ...fullBleed, bgcolor: "#f4f6f8", minHeight: "100%" }}>
      {/* Hero */}
      <Box
        sx={{
          background: HERO_GRADIENT,
          px: { xs: 2, md: 6 },
          pt: { xs: 3, md: 4 },
          pb: { xs: 10, md: 16 },
        }}
      >
        <Button
          onClick={() => router.push("/jobs")}
          startIcon={<ArrowBackIcon />}
          sx={{
            color: "#fff",
            fontWeight: 700,
            textTransform: "none",
            fontSize: "1.05rem",
            bgcolor: "rgba(255,255,255,0.15)",
            borderRadius: "12px",
            px: 2.5,
            py: 1,
            "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
          }}
        >
          Back To Jobs
        </Button>
      </Box>

      {/* Body (pulled up to overlap the hero) */}
      <Box
        sx={{
          px: { xs: 2, md: 6 },
          mt: { xs: -8, md: -12 },
          pb: 6,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Grid container spacing={4}>
          {/* Main card */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: "24px",
                bgcolor: "#fff",
                boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
              }}
            >
              <Chip
                label={employmentType || "Job"}
                sx={{
                  bgcolor: "rgba(0,151,167,0.12)",
                  color: TEAL,
                  fontWeight: 700,
                  borderRadius: "8px",
                  mb: 2,
                }}
              />

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: NAVY,
                  mb: 3,
                  lineHeight: 1.2,
                  fontSize: { xs: "1.6rem", md: "2.3rem" },
                }}
              >
                {job.jobTitle}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                <Box
                  sx={{
                    width: 84,
                    height: 84,
                    borderRadius: "16px",
                    border: "1px solid #eef2f4",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
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
                      sx={{ width: "100%", height: "100%", objectFit: "contain", p: 1 }}
                    />
                  ) : (
                    <ApartmentIcon sx={{ fontSize: 40, color: TEAL }} />
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: TEAL,
                    cursor: job.company?._id ? "pointer" : "default",
                  }}
                  onClick={() =>
                    job.company?._id && router.push(`/companies/${job.company._id}`)
                  }
                >
                  <ApartmentIcon sx={{ fontSize: 20 }} />
                  <Typography sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
                    {companyName}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Location */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <LocationIcon sx={{ color: TEAL, mt: "2px" }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      sx={{ color: "#8a97a3", fontSize: "0.85rem", fontWeight: 600 }}
                    >
                      Location
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: NAVY }}>
                      {locationText}
                    </Typography>
                  </Box>
                  {mapLink && (
                    <Button
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      endIcon={<OpenInNewIcon sx={{ fontSize: "16px !important" }} />}
                      size="small"
                      sx={{
                        color: TEAL,
                        fontWeight: 700,
                        textTransform: "none",
                        flexShrink: 0,
                        "&:hover": { bgcolor: "transparent", color: TEAL_DARK },
                      }}
                    >
                      Open in Maps
                    </Button>
                  )}
                </Box>

                {showMap &&
                  (isEmbedCode ? (
                    <Box
                      sx={{
                        mt: 2,
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: "1px solid #eef2f4",
                        "& iframe": {
                          width: "100%",
                          height: 220,
                          border: 0,
                          display: "block",
                        },
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
                        style={{
                          width: "100%",
                          height: "100%",
                          border: 0,
                          display: "block",
                        }}
                      />
                    </Box>
                  ))}
              </Box>

              {/* Images */}
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
                            borderRadius: "16px",
                            border: "1px solid #eef2f4",
                            bgcolor: "#f7f7f7",
                            display: "block",
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Description */}
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, mb: 2, color: NAVY }}
              >
                Job Description
              </Typography>
              <Box
                sx={{ color: "#555", lineHeight: 1.8 }}
                dangerouslySetInnerHTML={{
                  __html: job.jobDescription || "No description provided.",
                }}
              />

              {job.locationField && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: NAVY }}>
                    Location Details
                  </Typography>
                  <Box
                    sx={{ color: "#555", lineHeight: 1.8 }}
                    dangerouslySetInnerHTML={{ __html: job.locationField }}
                  />
                </Box>
              )}

              {documents.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: NAVY }}>
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
                          borderRadius: "12px",
                          border: "1px solid #eef2f4",
                          bgcolor: "#f7fafb",
                          textDecoration: "none",
                          color: NAVY,
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: TEAL,
                            bgcolor: "rgba(0,151,167,0.06)",
                          },
                        }}
                      >
                        <FileIcon sx={{ color: TEAL }} />
                        <Typography
                          sx={{
                            fontWeight: 600,
                            flexGrow: 1,
                            wordBreak: "break-word",
                          }}
                        >
                          {att.document.fileName || "Document"}
                        </Typography>
                        <DownloadIcon sx={{ color: "#8a97a3" }} />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              {videoUrl && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: NAVY }}>
                    Company Video
                  </Typography>
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: "16px",
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

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: "24px",
                bgcolor: "#fff",
                boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
              }}
            >
              <Stack spacing={3}>
                {/* Job Overview */}
                <Box
                  sx={{
                    bgcolor: "#f7fafb",
                    border: "1px solid #eef2f4",
                    borderRadius: "16px",
                    p: 2.5,
                  }}
                >
                  <Typography sx={{ fontWeight: 800, color: NAVY, mb: 1.5 }}>
                    Job Overview
                  </Typography>
                  {overviewRows.map((row, idx) => (
                    <Box
                      key={row.label}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: 2,
                        py: 1.4,
                        borderBottom:
                          idx === overviewRows.length - 1
                            ? "none"
                            : "1px dashed #d7e0e5",
                      }}
                    >
                      <Typography
                        sx={{ color: "#6b7a86", fontSize: "0.9rem", flexShrink: 0 }}
                      >
                        {row.label}
                      </Typography>
                      <Typography
                        sx={{
                          color: NAVY,
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          textAlign: "right",
                        }}
                      >
                        {row.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Contact Information */}
                {contactRows.length > 0 && (
                  <Box
                    sx={{
                      bgcolor: "#f7fafb",
                      border: "1px solid #eef2f4",
                      borderRadius: "16px",
                      p: 2.5,
                    }}
                  >
                    <Typography sx={{ fontWeight: 800, color: NAVY, mb: 2 }}>
                      Contact Information
                    </Typography>
                    <Stack spacing={2}>
                      {contactRows.map((row) => (
                        <Box key={row.label} sx={{ display: "flex", gap: 1.5 }}>
                          {row.icon}
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{ color: "#8a97a3", fontSize: "0.8rem", fontWeight: 600 }}
                            >
                              {row.label}
                            </Typography>
                            <Typography
                              sx={{
                                color: NAVY,
                                fontWeight: 600,
                                wordBreak: "break-word",
                              }}
                            >
                              {row.value}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {job.company?._id && (
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => router.push(`/companies/${job.company._id}`)}
                    sx={{
                      color: TEAL,
                      borderColor: TEAL,
                      borderRadius: "12px",
                      py: 1.3,
                      fontWeight: 700,
                      textTransform: "none",
                      "&:hover": { borderColor: TEAL_DARK, bgcolor: "rgba(0,151,167,0.06)" },
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
