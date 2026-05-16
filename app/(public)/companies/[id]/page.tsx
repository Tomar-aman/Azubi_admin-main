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
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => router.back()} sx={{ mr: 2, bgcolor: "#f5f5f5" }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Company Profile
        </Typography>
      </Box>

      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: "32px",
          bgcolor: "#1FA49A",
          color: "#fff",
          mb: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: "300px",
            height: "300px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
          }}
        />
        <Grid container spacing={4} alignItems="center">
          <Grid item>
            <Avatar
              src={employer.companyLogo ? `${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}/${employer.companyLogo}` : ""}
              sx={{
                width: { xs: 100, md: 150 },
                height: { xs: 100, md: 150 },
                borderRadius: "24px",
                border: "6px solid rgba(255,255,255,0.2)",
                bgcolor: "#fff",
              }}
            >
              {employer.companyName?.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs={12} sm>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: "2rem", md: "3.5rem" } }}>
              {employer.companyName}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
              <Chip
                icon={<WorkIcon sx={{ fontSize: "14px !important", color: "#fff !important" }} />}
                label={employer.industryName?.industryName || "Industry"}
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 600 }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <LocationIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2">{employer.address}</Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* Sidebar Info */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: "24px", border: "1px solid #eee" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Contact Details</Typography>
              <Stack spacing={2.5}>
                {employer.website && (
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <WebIcon sx={{ color: "#1FA49A" }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: "#999" }}>Website</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, display: "block" }}>{employer.website}</Typography>
                    </Box>
                  </Box>
                )}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <EmailIcon sx={{ color: "#1FA49A" }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "#999" }}>Email</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, display: "block" }}>{employer.email}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <PhoneIcon sx={{ color: "#1FA49A" }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "#999" }}>Phone</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, display: "block" }}>{employer.phoneNo}</Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>

            {employer.videoLink && employer.videoLink.length > 0 && employer.videoLink[0] !== "" && (
              <Paper elevation={0} sx={{ p: 4, borderRadius: "24px", border: "1px solid #eee", bgcolor: "#fcfdfd" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Company Video</Typography>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "16px",
                    overflow: "hidden",
                    pt: "56.25%", // 16:9 Aspect Ratio
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
          </Stack>
        </Grid>

        {/* Main Content: About & Jobs */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: "24px", border: "1px solid #eee", mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>About Company</Typography>
            <Box
              sx={{ color: "#555", lineHeight: 1.8, fontSize: "1.1rem" }}
              dangerouslySetInnerHTML={{ __html: employer.companyDescription || "No description provided." }}
            />
          </Paper>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Open Positions ({jobs?.length || 0})</Typography>
          </Box>

          <Grid container spacing={2}>
            {jobs && jobs.length > 0 ? (
              jobs.map((job: any) => (
                <Grid item xs={12} key={job._id}>
                  <Card
                    onClick={() => router.push(`/jobs/${job._id}`)}
                    sx={{
                      borderRadius: "16px",
                      border: "1px solid #eee",
                      cursor: "pointer",
                      transition: "0.2s",
                      "&:hover": { bgcolor: "#f9fdfd", borderColor: "#1FA49A" },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>{job.jobTitle}</Typography>
                          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#888" }}>
                              <LocationIcon sx={{ fontSize: 16 }} />
                              <Typography variant="caption">{job.city?.name}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#888" }}>
                              <WorkIcon sx={{ fontSize: 16 }} />
                              <Typography variant="caption">{job.jobType?.jobTypeName}</Typography>
                            </Box>
                          </Stack>
                        </Box>
                        <Button variant="outlined" sx={{ borderRadius: "8px", textTransform: "none", borderColor: "#1FA49A", color: "#1FA49A" }}>
                          Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" color="textSecondary" sx={{ fontStyle: "italic" }}>
                  No open positions currently available.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
