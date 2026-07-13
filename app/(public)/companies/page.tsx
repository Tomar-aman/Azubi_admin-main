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
  Button,
  Stack,
  Skeleton,
  MenuItem,
  Paper,
} from "@mui/material";
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Apartment as ApartmentIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { getAllEmployersForFrontend } from "@/app/api/employer/employer";
import { getRegions } from "@/app/api/regions/region";
import { getCity } from "@/app/api/city/city";

const TEAL = "#0097A7";
const TEAL_DARK = "#00808e";
const NAVY = "#1a2b3c";
const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const getImageUrl = (filepath: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL || "";
  return `${baseUrl.replace(/\/$/, "")}/${filepath.replace(/^\//, "")}`;
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [regions, setRegions] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const router = useRouter();

  const fetchCompanies = async () => {
    setLoading(true);
    const response = await getAllEmployersForFrontend({
      searchValue: searchValue,
      skip: 0,
    });

    if (response.remote === "success") {
      setCompanies(response.data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, [searchValue]);

  useEffect(() => {
    const fetchFilters = async () => {
      const [regionRes, cityRes] = await Promise.all([getRegions(), getCity()]);
      if (regionRes.remote === "success") setRegions(regionRes.data.data);
      if (cityRes.remote === "success") setCities(cityRes.data.data);
    };
    fetchFilters();
  }, []);

  const regionIdOf = (region: any): string | null => {
    if (!region) return null;
    if (typeof region === "string") return region;
    return region.id || region._id || null;
  };

  const cityOptions = useMemo(() => {
    if (!selectedRegion) return cities;
    const narrowed = cities.filter(
      (c) => regionIdOf(c.region) === selectedRegion,
    );
    return narrowed.length ? narrowed : cities;
  }, [cities, selectedRegion]);

  const filteredCompanies = companies.filter((company) => {
    const matchesLetter =
      !selectedLetter ||
      company.companyName?.toUpperCase().startsWith(selectedLetter);

    let matchesRegion = true;
    if (selectedRegion) {
      matchesRegion = regionIdOf(company.region) === selectedRegion;
    }

    let matchesCity = true;
    if (selectedCity) {
      matchesCity = company.location === selectedCity;
    }

    return matchesLetter && matchesRegion && matchesCity;
  });

  const handleCompanyClick = (id: string) => {
    router.push(`/companies/${id}`);
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
          Discover Top Companies
        </Typography>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.9)",
            mb: { xs: 3, md: 4 },
            fontSize: "1.05rem",
          }}
        >
          Search and explore a wide variety of employers offering great
          opportunities.
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
            placeholder="Search companies by name..."
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
        <Typography
          sx={{
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#7b8794",
            fontSize: "0.8rem",
            mb: 2,
          }}
        >
          FILTER BY COMPANY NAME
        </Typography>
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            {ALPHABETS.map((letter) => {
              const active = selectedLetter === letter;
              return (
                <Button
                  key={letter}
                  onClick={() => setSelectedLetter(active ? null : letter)}
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
            Array.from(new Array(8)).map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Skeleton
                  variant="rectangular"
                  height={240}
                  sx={{ borderRadius: "16px" }}
                />
              </Grid>
            ))
          ) : filteredCompanies.length ? (
            filteredCompanies.map((company) => (
              <Grid item xs={12} sm={6} md={3} key={company._id}>
                <Card
                  onClick={() => handleCompanyClick(company._id)}
                  elevation={0}
                  sx={{
                    borderRadius: "16px",
                    cursor: "pointer",
                    height: "100%",
                    minHeight: 240,
                    border: "1px solid #edf1f4",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 24px rgba(0, 151, 167, 0.12)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        py: 2,
                      }}
                    >
                      {company.companyLogo ? (
                        <Box
                          component="img"
                          src={getImageUrl(company.companyLogo)}
                          alt={company.companyName}
                          sx={{
                            maxWidth: "80%",
                            maxHeight: 90,
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 90,
                            height: 90,
                            borderRadius: "16px",
                            bgcolor: "#eef7f8",
                            color: TEAL,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ApartmentIcon sx={{ fontSize: 44 }} />
                        </Box>
                      )}
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        color: NAVY,
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {company.companyName}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h6" color="textSecondary">
                  No companies found
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}
