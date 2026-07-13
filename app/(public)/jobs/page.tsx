"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Button,
  MenuItem,
  Paper,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Apartment as ApartmentIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { getAllJobs } from "@/app/api/jobs/jobs";
import { getRegions } from "@/app/api/regions/region";
import { getCity } from "@/app/api/city/city";

const TEAL = "#0097A7";
const TEAL_DARK = "#00808e";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [regions, setRegions] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchFilters = async () => {
      const [regionRes, cityRes] = await Promise.all([getRegions(), getCity()]);
      if (regionRes.remote === "success") {
        setRegions(regionRes.data.data);
      }
      if (cityRes.remote === "success") {
        setCities(cityRes.data.data);
      }
    };
    fetchFilters();
  }, []);

  // Helper: normalise a region reference (string id or populated object) to an id
  const regionIdOf = (region: any): string | null => {
    if (!region) return null;
    if (typeof region === "string") return region;
    return region.id || region._id || null;
  };

  // Narrow the city dropdown to the selected region, falling back to all cities
  // if the region link can't be resolved (keeps the filter usable regardless).
  const cityOptions = useMemo(() => {
    if (!selectedRegion) return cities;
    const narrowed = cities.filter(
      (c) => regionIdOf(c.region) === selectedRegion,
    );
    return narrowed.length ? narrowed : cities;
  }, [cities, selectedRegion]);

  const filteredJobs = jobs.filter((job) => {
    const matchesLetter =
      !selectedLetter || job.jobTitle?.toUpperCase().startsWith(selectedLetter);

    let matchesRegion = true;
    if (selectedRegion) {
      matchesRegion = regionIdOf(job.region) === selectedRegion;
    }

    let matchesCity = true;
    if (selectedCity) {
      matchesCity = Array.isArray(job.city)
        ? job.city.includes(selectedCity)
        : job.city === selectedCity;
    }

    return matchesLetter && matchesRegion && matchesCity;
  });

  const handleJobClick = (id: string) => {
    router.push(`/jobs/${id}`);
  };

  const selectSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      bgcolor: "#fff",
      "& fieldset": { borderColor: "#e0e0e0" },
      "&:hover fieldset": { borderColor: TEAL },
      "&.Mui-focused fieldset": { borderColor: TEAL },
    },
  };

  return (
    <Box
      sx={{
        mt: { xs: -2, md: -4 },
        mx: { xs: -2, md: -4 },
        mb: { xs: -2, md: -4 },
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
      }}
    >
      {/* Hero */}
      <Box
        sx={{
          bgcolor: TEAL,
          px: { xs: 2, md: 5 },
          pt: 3,
          pb: { xs: 5, md: 8 },
          textAlign: "center",
        }}
      >
        <Stack
          direction="row"
          spacing={4}
          justifyContent="flex-end"
          sx={{ mb: { xs: 3, md: 5 } }}
        >
          <Button
            onClick={() => router.push("/companies")}
            sx={{
              color: "#fff",
              fontWeight: 700,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": { bgcolor: "transparent", opacity: 0.85 },
            }}
          >
            Companies
          </Button>
          <Button
            onClick={() => router.push("/jobs")}
            sx={{
              color: "#fff",
              fontWeight: 700,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": { bgcolor: "transparent", opacity: 0.85 },
            }}
          >
            Jobs
          </Button>
        </Stack>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: "#fff",
            mb: 1.5,
            fontSize: { xs: "2rem", md: "2.75rem" },
          }}
        >
          Find Your Dream Job
        </Typography>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.9)",
            mb: { xs: 3, md: 4 },
            fontSize: "1.05rem",
          }}
        >
          Browse through thousands of open positions
        </Typography>

        <Paper
          elevation={0}
          sx={{
            maxWidth: "900px",
            mx: "auto",
            p: 1,
            borderRadius: "16px",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 1,
            alignItems: "stretch",
          }}
        >
          <TextField
            placeholder="Search jobs by title, keyword..."
            variant="outlined"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ flexGrow: 1, ...selectSx }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: TEAL }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            value={selectedRegion || ""}
            onChange={(e) => {
              setSelectedRegion(e.target.value || null);
              setSelectedCity(null);
            }}
            variant="outlined"
            sx={{ width: { xs: "100%", md: "230px" }, ...selectSx }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon sx={{ color: TEAL }} />
                </InputAdornment>
              ),
            }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (value: any) => {
                const selected = regions.find((r) => r.id === value);
                return (
                  <Typography sx={{ color: selected ? "#333" : "#9e9e9e" }}>
                    {selected ? selected.name : "Region auswählen"}
                  </Typography>
                );
              },
            }}
          >
            <MenuItem value="">Alle Regionen</MenuItem>
            {regions.map((reg) => (
              <MenuItem key={reg.id} value={reg.id}>
                {reg.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            value={selectedCity || ""}
            onChange={(e) => setSelectedCity(e.target.value || null)}
            variant="outlined"
            sx={{ width: { xs: "100%", md: "230px" }, ...selectSx }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon sx={{ color: TEAL }} />
                </InputAdornment>
              ),
            }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (value: any) => (
                <Typography sx={{ color: value ? "#333" : "#9e9e9e" }}>
                  {value || "Stadt auswählen"}
                </Typography>
              ),
            }}
          >
            <MenuItem value="">Alle Städte</MenuItem>
            {cityOptions.map((city) => (
              <MenuItem key={city.id} value={city.name}>
                {city.name}
              </MenuItem>
            ))}
          </TextField>
        </Paper>
      </Box>

      {/* Body */}
      <Box
        sx={{
          bgcolor: "#f4f6f8",
          px: { xs: 2, md: 6 },
          py: { xs: 4, md: 5 },
          flexGrow: 1,
        }}
      >
        {/* Alphabet Filter */}
        <Typography
          sx={{
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#7b8794",
            fontSize: "0.8rem",
            mb: 2,
          }}
        >
          FILTER BY JOB TITLE
        </Typography>
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            {ALPHABETS.map((letter) => {
              const active = selectedLetter === letter;
              return (
                <Button
                  key={letter}
                  onClick={() =>
                    setSelectedLetter(active ? null : letter)
                  }
                  sx={{
                    minWidth: "42px",
                    width: "42px",
                    height: "42px",
                    p: 0,
                    borderRadius: "8px",
                    fontWeight: 700,
                    textTransform: "none",
                    bgcolor: active ? TEAL : "#fff",
                    color: active ? "#fff" : "#4a5568",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    "&:hover": {
                      bgcolor: active ? TEAL_DARK : "#eef7f8",
                      color: active ? "#fff" : TEAL,
                    },
                  }}
                >
                  {letter}
                </Button>
              );
            })}
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {loading ? (
            Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton
                  variant="rectangular"
                  height={220}
                  sx={{ borderRadius: "16px" }}
                />
              </Grid>
            ))
          ) : filteredJobs.length ? (
            filteredJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id}>
                <Card
                  onClick={() => handleJobClick(job._id)}
                  elevation={0}
                  sx={{
                    borderRadius: "16px",
                    cursor: "pointer",
                    height: "100%",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    border: "1px solid #edf1f4",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 24px rgba(0, 151, 167, 0.12)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: "#1a2b3c",
                        mb: 2,
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "3.9em",
                      }}
                    >
                      {job.jobTitle}
                    </Typography>

                    <Stack spacing={1.2} sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1,
                          color: "#5a6b7b",
                        }}
                      >
                        <ApartmentIcon sx={{ fontSize: 18, mt: "1px" }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {typeof job.company === "string"
                            ? job.company
                            : job.company?.name ||
                              job.companyDetail?.name ||
                              "—"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1,
                          color: "#8a97a3",
                        }}
                      >
                        <LocationIcon sx={{ fontSize: 18, mt: "1px" }} />
                        <Typography variant="body2">
                          {[
                            job.address,
                            job.zipCode,
                            Array.isArray(job.city)
                              ? job.city.filter(Boolean).join(", ")
                              : job.city,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Multiple Locations"}
                        </Typography>
                      </Box>
                    </Stack>

                    <Box sx={{ mt: "auto" }}>
                      <Divider sx={{ mb: 1.5 }} />
                      <Button
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          p: 0,
                          color: TEAL,
                          fontWeight: 700,
                          textTransform: "none",
                          fontSize: "0.95rem",
                          "&:hover": { bgcolor: "transparent", color: TEAL_DARK },
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
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
    </Box>
  );
}
