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
  Button,
  Stack,
  Skeleton,
} from "@mui/material";
import { Search as SearchIcon, LocationOn as LocationIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { getAllEmployersForFrontend } from "@/app/api/employer/employer";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
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

  const filteredCompanies = companies.filter((company) => {
    if (!selectedLetter) return true;
    return company.companyName.toUpperCase().startsWith(selectedLetter);
  });

  const handleCompanyClick = (id: string) => {
    router.push(`/companies/${id}`);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#1FA49A" }}>
          Companies
        </Typography>
        <TextField
          placeholder="Search companies..."
          variant="outlined"
          size="small"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{
            width: { xs: "100%", sm: "300px" },
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
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: "16px" }} />
              </Grid>
            ))
          : filteredCompanies.map((company) => (
              <Grid item xs={12} sm={6} md={4} key={company._id}>
                <Card
                  onClick={() => handleCompanyClick(company._id)}
                  sx={{
                    borderRadius: "16px",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    border: "1px solid #eef7f6",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 24px rgba(31, 164, 154, 0.12)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        src={
                          company.companyLogo
                            ? `${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}/${company.companyLogo}`
                            : ""
                        }
                        alt={company.companyName}
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: "12px",
                          bgcolor: "#eef7f6",
                          color: "#1FA49A",
                          fontWeight: 700,
                          fontSize: "1.5rem",
                        }}
                      >
                        {company.companyName?.charAt(0)}
                      </Avatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#333", lineHeight: 1.2 }}>
                          {company.companyName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#1FA49A", fontWeight: 500 }}>
                          {company.industryName?.industryName || "Industry"}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5, color: "#666" }}>
                      <LocationIcon sx={{ fontSize: 18, mt: 0.2, color: "#999" }} />
                      <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                        {company.address || "No address provided"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        {!loading && filteredCompanies.length === 0 && (
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
  );
}
