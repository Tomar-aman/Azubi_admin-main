"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Divider,
  Avatar,
  Paper,
  Skeleton,
  IconButton,
  Stack,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Language as WebIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  PlayCircleOutline as PlayIcon,
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import { getCompanyDetail } from "@/app/api/employer/employer";
import { getYoutubeEmbedUrl } from "@/app/ulits/youtube";

export default function CompanyDetailPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const response = await getCompanyDetail(id);
      if (response.remote === "success") {
        setData(response.data.data);
      }
      setLoading(false);
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: "24px", mb: 4 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: "24px" }} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={600} sx={{ borderRadius: "24px" }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (!data) return null;

  const { employer, jobs } = data;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F5F7F9" }}>
      {/* Header Bar */}
      <Box sx={{ bgcolor: "#1FA49A", py: 2, px: { xs: 2, md: 6 } }}>
        <Button
          onClick={() => router.back()}
          startIcon={<ArrowBackIcon />}
          sx={{
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "14px",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          }}
        >
          Back To Companies
        </Button>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ p: { xs: 2, md: 6 }, maxWidth: "1200px", mx: "auto" }}>
        <Grid container spacing={4}>
          
          {/* Left Column (Main Card + Jobs) */}
          <Grid item xs={12} md={8}>
            
            {/* Main Company Details Card */}
            <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: "16px", mb: 4 }}>
              
              {/* Header Section of Card */}
              <Box sx={{ display: "flex", gap: 3, mb: 4, alignItems: "flex-start", flexWrap: { xs: "wrap", sm: "nowrap" } }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "16px",
                    border: "1px solid #eee",
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#fff",
                    overflow: "hidden",
                    flexShrink: 0
                  }}
                >
                  {employer.companyLogo ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}/${employer.companyLogo}`}
                      alt={employer.companyName}
                      style={{ width: "80%", height: "80%", objectFit: "contain" }}
                    />
                  ) : (
                    <Avatar sx={{ width: "100%", height: "100%", borderRadius: 0, bgcolor: "#fff", color: "#888", fontSize: "2rem", fontWeight: 700 }}>
                      {employer.companyName?.charAt(0)}
                    </Avatar>
                  )}
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a1a1a", mb: 1.5 }}>
                    {employer.companyName}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                      icon={<WorkIcon sx={{ fontSize: "14px !important", color: "#1FA49A !important" }} />}
                      label={employer.industryName?.industryName || "Industry"}
                      size="small"
                      sx={{ bgcolor: "#e6f3f3", color: "#1FA49A", fontWeight: 600, borderRadius: "8px" }}
                    />
                    <Chip
                      icon={<LocationIcon sx={{ fontSize: "14px !important", color: "#1FA49A !important" }} />}
                      label={employer.address}
                      size="small"
                      sx={{ bgcolor: "#e6f3f3", color: "#1FA49A", fontWeight: 600, borderRadius: "8px" }}
                    />
                  </Stack>
                </Box>
              </Box>

              {/* Description */}
              <Box
                sx={{
                  color: "#4a4a4a",
                  lineHeight: 1.8,
                  fontSize: "13px",
                  "& h2, & h3, & h4": { color: "#1a1a1a", fontWeight: 700, mt: 4, mb: 2, fontSize: "15px" },
                  "& ul": { pl: 2, mb: 3 },
                  "& li": { mb: 1 }
                }}
                dangerouslySetInnerHTML={{ __html: employer.companyDescription || "No description provided." }}
              />

              {/* Gallery (if any) */}
              {employer.companyImages && employer.companyImages.length > 0 && (
                <Box sx={{ mt: 5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#1a1a1a", mb: 2, fontSize: "15px" }}>
                    Gallery
                  </Typography>
                  <Grid container spacing={2}>
                    {employer.companyImages.map((img: string, idx: number) => (
                      <Grid item xs={6} sm={3} key={idx}>
                        <Box
                          sx={{
                            width: "100%",
                            paddingTop: "100%",
                            position: "relative",
                            borderRadius: "12px",
                            overflow: "hidden"
                          }}
                        >
                          <img
                            src={`${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}/${img}`}
                            alt={`Gallery image ${idx + 1}`}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
                            }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Paper>

            {/* Open Positions Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#1a1a1a", fontSize: "18px" }}>
                Offene Stellen
              </Typography>
            </Box>

            <Stack spacing={2}>
              {jobs && jobs.length > 0 ? (
                jobs.map((job: any) => (
                  <Paper
                    key={job._id}
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid transparent",
                      transition: "0.2s",
                      "&:hover": { borderColor: "#1FA49A", boxShadow: "0 4px 12px rgba(0,139,139,0.05)" }
                    }}
                  >
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#1a1a1a", mb: 1, fontSize: "15px" }}>
                        {job.jobTitle}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#888" }}>
                        <LocationIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2">{job.city?.name}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1.5 }}>
                      <Chip
                        label={job.jobType?.jobTypeName || "Job"}
                        size="small"
                        sx={{ bgcolor: "#f5f7f9", color: "#666", fontWeight: 700, borderRadius: "6px", fontSize: "11px", letterSpacing: "0.5px", textTransform: "uppercase" }}
                      />
                      <Button
                        variant="contained"
                        onClick={() => router.push(`/jobs/${job._id}`)}
                        sx={{
                          bgcolor: "#1FA49A",
                          color: "#fff",
                          textTransform: "none",
                          fontWeight: 700,
                          borderRadius: "8px",
                          px: 3,
                          fontSize: "13px",
                          boxShadow: "none",
                          "&:hover": { bgcolor: "#1a8c83", boxShadow: "none" }
                        }}
                      >
                        Details ansehen
                      </Button>
                    </Box>
                  </Paper>
                ))
              ) : (
                <Typography variant="body1" color="textSecondary" sx={{ fontStyle: "italic" }}>
                  No open positions currently available.
                </Typography>
              )}
            </Stack>

          </Grid>

          {/* Right Column (Contact Info) */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: "16px" }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: "#1a1a1a", fontSize: "15px" }}>
                Contact Information
              </Typography>
              <Stack spacing={3}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <Box sx={{ bgcolor: "#e6f3f3", p: 1, borderRadius: "8px", display: "flex" }}>
                    <EmailIcon sx={{ color: "#008B8B", fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#888", fontWeight: 700, display: "block", mb: 0.5, letterSpacing: "0.5px" }}>EMAIL</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1a1a1a" }}>{employer.email}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <Box sx={{ bgcolor: "#e6f3f3", p: 1, borderRadius: "8px", display: "flex" }}>
                    <PhoneIcon sx={{ color: "#008B8B", fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#888", fontWeight: 700, display: "block", mb: 0.5, letterSpacing: "0.5px" }}>PHONE</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1a1a1a" }}>{employer.phoneNo}</Typography>
                  </Box>
                </Box>

                {employer.website && (
                  <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                    <Box sx={{ bgcolor: "#e6f3f3", p: 1, borderRadius: "8px", display: "flex" }}>
                      <WebIcon sx={{ color: "#008B8B", fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#888", fontWeight: 700, display: "block", mb: 0.5, letterSpacing: "0.5px" }}>WEBSITE</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1a1a1a" }}>{employer.website}</Typography>
                    </Box>
                  </Box>
                )}
              </Stack>
            </Paper>

            {/* Video Box if it exists */}
            {employer.videoLink && employer.videoLink.length > 0 && employer.videoLink[0] !== "" && (
              <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", mt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: "#1a1a1a", fontSize: "15px" }}>Company Video</Typography>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "12px",
                    overflow: "hidden",
                    pt: "56.25%", 
                  }}
                >
                  <iframe
                    src={getYoutubeEmbedUrl(employer.videoLink[0])}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                    allowFullScreen
                  />
                </Box>
              </Paper>
            )}
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
}
