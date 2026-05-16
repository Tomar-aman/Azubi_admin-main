"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  Avatar,
  Paper,
  Skeleton,
  IconButton,
  Stack,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  WorkOutline as WorkIcon,
  Language as WebIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import { getJobDetailById } from "@/app/api/jobs/jobs";
import { getYoutubeEmbedUrl } from "@/app/ulits/youtube";

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

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton variant="text" width="200px" height={40} sx={{ mb: 4 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: "20px" }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: "20px" }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (!job) return null;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1200px", margin: "0 auto" }}>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => router.back()} sx={{ mr: 2, bgcolor: "#f5f5f5" }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Job Details
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: "24px", border: "1px solid #eee", bgcolor: "#fff" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 800, color: "#333", mb: 1, fontSize: { xs: "1.75rem", md: "2.5rem" } }}>
                  {job.jobTitle}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Chip label={job.jobType?.jobTypeName || "Full Time"} color="primary" sx={{ bgcolor: "#1FA49A", fontWeight: 600 }} />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#666" }}>
                    <CalendarIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2">{new Date(job.createdAt).toLocaleDateString()}</Typography>
                  </Box>
                </Stack>
              </Box>
              <IconButton sx={{ border: "1px solid #eee" }}>
                <ShareIcon />
              </IconButton>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Job Description
            </Typography>
            <Box 
              sx={{ color: "#555", lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: job.jobDescription || "No description provided." }}
            />

            {job.locationField && (
               <Box sx={{ mt: 4 }}>
                 <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                   Location
                 </Typography>
                 <Box 
                   sx={{ color: "#555", lineHeight: 1.8 }}
                   dangerouslySetInnerHTML={{ __html: job.locationField }}
                 />
               </Box>
            )}
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Company Card */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: "24px", border: "1px solid #eee", bgcolor: "#fcfdfd" }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Avatar
                  src={job.company?.logo ? `${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}/${job.company.logo}` : ""}
                  sx={{ width: 80, height: 80, mx: "auto", mb: 2, borderRadius: "16px", border: "4px solid #fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                >
                  {job.company?.name?.charAt(0)}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{job.company?.name}</Typography>
                <Typography variant="body2" color="textSecondary">{job.company?.industry}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <LocationIcon sx={{ color: "#1FA49A" }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "#999", display: "block" }}>Location</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{job.company?.address || "N/A"}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <BusinessIcon sx={{ color: "#1FA49A" }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "#999", display: "block" }}>Email</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{job.company?.email || "N/A"}</Typography>
                  </Box>
                </Box>
                {job.company?.website && (
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <WebIcon sx={{ color: "#1FA49A" }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: "#999", display: "block" }}>Website</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{job.company.website}</Typography>
                    </Box>
                  </Box>
                )}
              </Stack>

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, bgcolor: "#1FA49A", borderRadius: "12px", py: 1.5, fontWeight: 600, textTransform: "none" }}
                onClick={() => router.push(`/companies/${job.company?._id}`)}
              >
                View Company Profile
              </Button>
            </Paper>

            {job.videoLink && job.videoLink.length > 0 && job.videoLink[0] !== "" && (
              <Paper elevation={0} sx={{ p: 3, borderRadius: "24px", border: "1px solid #eee", bgcolor: "#fcfdfd" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Company Video</Typography>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "16px",
                    overflow: "hidden",
                    pt: "56.25%", // 16:9 Aspect Ratio
                  }}
                >
                  <iframe
                    src={getYoutubeEmbedUrl(job.videoLink[0])}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                    allowFullScreen
                  />
                </Box>
              </Paper>
            )}

            {/* Quick Info */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: "24px", border: "1px solid #eee", bgcolor: "#fff" }}>
               <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Quick Info</Typography>
               <Stack spacing={2}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="textSecondary">Education</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{job.training?.trainingName || "N/A"}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="textSecondary">Starting</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{job.beginning?.beginningName || "Anytime"}</Typography>
                  </Box>
               </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
