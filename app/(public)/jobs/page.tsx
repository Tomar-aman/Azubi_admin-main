"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Avatar,
  Skeleton,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import { Search as SearchIcon, LocationOn as LocationIcon, Work as WorkIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { getAllJobs } from "@/app/api/jobs/jobs";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const router = useRouter();

  const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const fetchJobs = async () => {
    setLoading(true);
    const response = await getAllJobs({
      searchValue: searchValue,
      pageNo: 1,
      recordPerPage: "100", // Increased to allow client-side filtering of more jobs
      isFrontend: "true",
    });

    if (response.remote === "success") {
      setJobs(response.data.data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [searchValue]);

  const filteredJobs = jobs.filter((job) => {
    if (!selectedLetter) return true;
    return job.jobTitle.toUpperCase().startsWith(selectedLetter);
  });

  const handleJobClick = (id: string) => {
    router.push(`/jobs/${id}`);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#1FA49A" }}>
          Explore Jobs
        </Typography>
        <TextField
          placeholder="Search jobs..."
          variant="outlined"
          size="small"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{
            width: { xs: "100%", sm: "350px" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: "#f8fdfd",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#1FA49A" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Alphabet Filter */}
      <Box sx={{ mb: 4, overflowX: "auto", pb: 1 }}>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant={selectedLetter === null ? "contained" : "outlined"}
            onClick={() => setSelectedLetter(null)}
            sx={{
              minWidth: "40px",
              borderRadius: "8px",
              textTransform: "none",
              bgcolor: selectedLetter === null ? "#1FA49A" : "transparent",
              color: selectedLetter === null ? "#fff" : "#1FA49A",
              borderColor: "#1FA49A",
              "&:hover": {
                bgcolor: selectedLetter === null ? "#168a81" : "rgba(31, 164, 154, 0.04)",
                borderColor: "#1FA49A",
              },
            }}
          >
            All
          </Button>
          {ALPHABETS.map((letter) => (
            <Button
              key={letter}
              size="small"
              variant={selectedLetter === letter ? "contained" : "outlined"}
              onClick={() => setSelectedLetter(letter)}
              sx={{
                minWidth: "40px",
                borderRadius: "8px",
                textTransform: "none",
                bgcolor: selectedLetter === letter ? "#1FA49A" : "transparent",
                color: selectedLetter === letter ? "#fff" : "#1FA49A",
                borderColor: "#1FA49A",
                "&:hover": {
                  bgcolor: selectedLetter === letter ? "#168a81" : "rgba(31, 164, 154, 0.04)",
                  borderColor: "#1FA49A",
                },
              }}
            >
              {letter}
            </Button>
          ))}
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {loading
          ? Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: "16px" }} />
              </Grid>
            ))
          : filteredJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id}>
                <Card
                  onClick={() => handleJobClick(job._id)}
                  sx={{
                    borderRadius: "16px",
                    cursor: "pointer",
                    height: "100%",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    border: "1px solid #eef7f6",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 24px rgba(31, 164, 154, 0.12)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                      <Avatar
                        src={
                          job.company?.logo
                            ? `${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}/${job.company.logo}`
                            : ""
                        }
                        alt={job.company?.name}
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "10px",
                          bgcolor: "#eef7f6",
                          color: "#1FA49A",
                        }}
                      >
                        {job.company?.name?.charAt(0)}
                      </Avatar>
                      <Chip
                        label={job.jobType || "Job"}
                        size="small"
                        sx={{
                          bgcolor: "rgba(31, 164, 154, 0.1)",
                          color: "#1FA49A",
                          fontWeight: 600,
                          borderRadius: "6px",
                        }}
                      />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#333", mb: 0.5 }}>
                      {job.jobTitle}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", mb: 2, fontWeight: 500 }}>
                      {job.company?.name}
                    </Typography>
                    
                    <Stack spacing={1} sx={{ mt: "auto" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#888" }}>
                        <LocationIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">{job.city?.join(", ") || "Multiple Locations"}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#888" }}>
                        <WorkIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">{job.company?.industry || "Industry"}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        {!loading && jobs.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="textSecondary">
                No jobs found
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
