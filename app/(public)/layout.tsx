"use client";

import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <AppBar
        position="static"
        sx={{
          background: "#e5f3f3",
          color: "#000",
          boxShadow: "none",
          padding: "19px 18px",
        }}
      >
        <Toolbar
          sx={{ minHeight: "auto !important", padding: "0px !important" }}
        >
          <Typography
            variant="h6"
            sx={{
              mr: 4,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => router.push("/")}
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={180}
              height={38}
              style={{ objectFit: "contain" }}
            />
          </Typography>

          <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
            <Button
              onClick={() => router.push("/jobs")}
              sx={{
                color: pathname.includes("/jobs") ? "#1FA49A" : "#646464",
                fontWeight: 700,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              Jobs
            </Button>
            <Button
              onClick={() => router.push("/companies")}
              sx={{
                color: pathname.includes("/companies") ? "#1FA49A" : "#646464",
                fontWeight: 700,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              Companies
            </Button>
          </Stack>

          <Button
            variant="contained"
            onClick={() => router.push("/")}
            sx={{
              bgcolor: "#1FA49A",
              borderRadius: "10px",
              px: 3,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { bgcolor: "#168a81" },
            }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flexGrow: 1, background: "#fff", overflow: "hidden" }}>
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
            height: "100%",
            overflowY: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
